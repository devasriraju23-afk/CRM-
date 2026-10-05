import { query, getClient } from '../config/database.js';
import { uploadFile, deleteFile as deleteStorageFile } from '../config/storage.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildResourceQuery = ({ search, department, semester, subject, type, status, uploadedBy, sort, page, limit, forRole }) => {
  const params   = [];
  const where    = [];
  const safeRole = forRole || 'student';

  // Visibility: students only see approved
  if (safeRole === 'student') {
    where.push(`r.status = 'approved'`);
  } else if (status) {
    params.push(status);
    where.push(`r.status = $${params.length}`);
  }

  if (uploadedBy) {
    params.push(uploadedBy);
    where.push(`r.uploaded_by = $${params.length}`);
  }

  if (search) {
    params.push(search);
    where.push(`(r.search_vector @@ plainto_tsquery('english', $${params.length})
                 OR r.title ILIKE '%' || $${params.length} || '%')`);
  }

  if (department) {
    params.push(department);
    where.push(`r.department_id = $${params.length}`);
  }

  if (semester) {
    params.push(parseInt(semester));
    where.push(`r.semester = $${params.length}`);
  }

  if (subject) {
    params.push(subject);
    where.push(`r.subject_id = $${params.length}`);
  }

  if (type) {
    params.push(type);
    where.push(`r.resource_type = $${params.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sortMap = {
    newest:    'r.created_at DESC',
    oldest:    'r.created_at ASC',
    downloads: 'r.download_count DESC',
    views:     'r.view_count DESC',
    title:     'r.title ASC',
  };
  const orderBy = sortMap[sort] || 'r.created_at DESC';

  const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20);
  params.push(parseInt(limit) || 20);
  params.push(offset);
  const pagination = `LIMIT $${params.length - 1} OFFSET $${params.length}`;

  return { whereClause, orderBy, pagination, params };
};

// ── Public API ────────────────────────────────────────────────────────────────

export const getResources = async (filters) => {
  const { whereClause, orderBy, pagination, params } = buildResourceQuery(filters);

  const countParams = params.slice(0, params.length - 2);
  const countResult = await query(
    `SELECT COUNT(*) FROM resources r ${whereClause}`,
    countParams
  );

  const result = await query(
    `SELECT r.id, r.title, r.description, r.resource_type, r.category,
            r.semester, r.file_url, r.file_type, r.file_size, r.thumbnail_url,
            r.status, r.download_count, r.view_count, r.created_at, r.updated_at,
            d.id AS department_id, d.name AS department_name, d.code AS department_code,
            s.id AS subject_id, s.name AS subject_name,
            u.id AS uploader_id, u.first_name AS uploader_first_name,
            u.last_name AS uploader_last_name,
            ARRAY(SELECT tag FROM resource_tags WHERE resource_id = r.id ORDER BY tag) AS tags
     FROM resources r
     JOIN departments d ON d.id = r.department_id
     LEFT JOIN subjects s ON s.id = r.subject_id
     JOIN users u ON u.id = r.uploaded_by
     ${whereClause}
     ORDER BY ${orderBy}
     ${pagination}`,
    params
  );

  return { resources: result.rows, total: parseInt(countResult.rows[0].count) };
};

export const getResourceById = async (id, userId) => {
  const result = await query(
    `SELECT r.*, d.name AS department_name, d.code AS department_code,
            s.name AS subject_name, s.code AS subject_code,
            u.id AS uploader_id, u.first_name AS uploader_first_name,
            u.last_name AS uploader_last_name, u.email AS uploader_email,
            ARRAY(SELECT tag FROM resource_tags WHERE resource_id = r.id ORDER BY tag) AS tags
     FROM resources r
     JOIN departments d ON d.id = r.department_id
     LEFT JOIN subjects s ON s.id = r.subject_id
     JOIN users u ON u.id = r.uploaded_by
     WHERE r.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('Resource not found.', 404);

  const resource = result.rows[0];

  // Increment view count
  await query('UPDATE resources SET view_count = view_count + 1 WHERE id = $1', [id]);
  resource.view_count += 1;

  // Bookmark status for the requesting user
  if (userId) {
    const bk = await query('SELECT id FROM bookmarks WHERE user_id = $1 AND resource_id = $2', [userId, id]);
    resource.is_bookmarked = bk.rows.length > 0;
  }

  return resource;
};

export const createResource = async ({ title, description, resourceType, category, departmentId, subjectId, semester, tags, uploadedBy }, files) => {
  if (!files?.file?.[0]) throw new AppError('File is required.', 400);

  const fileBuffer    = files.file[0].buffer;
  const originalName  = files.file[0].originalname;
  const mimeType      = files.file[0].mimetype;
  const fileSize      = files.file[0].size;
  const fileTypeLabel = mimeType.split('/')[1] || 'unknown';

  const { url: fileUrl, key: fileKey } = await uploadFile(fileBuffer, originalName, mimeType);

  let thumbnailUrl = null;
  if (files.thumbnail?.[0]) {
    const { url } = await uploadFile(files.thumbnail[0].buffer, files.thumbnail[0].originalname, files.thumbnail[0].mimetype);
    thumbnailUrl = url;
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO resources
         (title, description, resource_type, category, department_id, subject_id,
          semester, file_url, file_key, file_type, file_size, thumbnail_url, uploaded_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [title, description || null, resourceType, category || null,
       departmentId, subjectId || null, semester || null,
       fileUrl, fileKey, fileTypeLabel, fileSize, thumbnailUrl, uploadedBy]
    );

    const resource = result.rows[0];

    // Insert tags
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      for (const tag of tagList) {
        await client.query(
          'INSERT INTO resource_tags (resource_id, tag) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [resource.id, tag]
        );
      }
    }

    await client.query('COMMIT');
    logger.info(`Resource uploaded: "${title}" by user ${uploadedBy}`);
    return resource;
  } catch (err) {
    await client.query('ROLLBACK');
    // Clean up uploaded file
    await deleteStorageFile(fileKey);
    throw err;
  } finally {
    client.release();
  }
};

export const updateResource = async (id, userId, role, updates) => {
  // Only uploader or admin can update
  const existing = await query('SELECT * FROM resources WHERE id = $1', [id]);
  if (!existing.rows.length) throw new AppError('Resource not found.', 404);

  const resource = existing.rows[0];
  if (role !== 'admin' && resource.uploaded_by !== userId) {
    throw new AppError('You can only edit your own resources.', 403);
  }

  const { title, description, category, semester, tags } = updates;

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE resources SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         category    = COALESCE($3, category),
         semester    = COALESCE($4, semester),
         updated_at  = NOW()
       WHERE id = $5 RETURNING *`,
      [title||null, description||null, category||null, semester||null, id]
    );

    // Replace tags if provided
    if (tags !== undefined) {
      await client.query('DELETE FROM resource_tags WHERE resource_id = $1', [id]);
      const tagList = (tags || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      for (const tag of tagList) {
        await client.query(
          'INSERT INTO resource_tags (resource_id, tag) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [id, tag]
        );
      }
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const deleteResource = async (id, userId, role) => {
  const existing = await query('SELECT * FROM resources WHERE id = $1', [id]);
  if (!existing.rows.length) throw new AppError('Resource not found.', 404);

  const resource = existing.rows[0];
  if (role !== 'admin' && resource.uploaded_by !== userId) {
    throw new AppError('You can only delete your own resources.', 403);
  }

  await query('DELETE FROM resources WHERE id = $1', [id]);
  await deleteStorageFile(resource.file_key);
  logger.info(`Resource deleted: ${id} by user ${userId}`);
};

export const downloadResource = async (id, userId, ip) => {
  const result = await query(
    `SELECT r.*, d.name AS department_name FROM resources r
     JOIN departments d ON d.id = r.department_id WHERE r.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('Resource not found.', 404);

  const resource = result.rows[0];
  if (resource.status !== 'approved') throw new AppError('Resource is not available for download.', 403);

  // Log download
  await query(
    'INSERT INTO downloads (user_id, resource_id, ip_address) VALUES ($1,$2,$3)',
    [userId, id, ip || null]
  );
  await query('UPDATE resources SET download_count = download_count + 1 WHERE id = $1', [id]);

  logger.info(`Resource downloaded: ${id} by user ${userId}`);
  return resource;
};
