import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAnnouncements = async ({ departmentId, role, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const where  = ['a.is_active = TRUE', `(a.expires_at IS NULL OR a.expires_at > NOW())`];

  if (departmentId) {
    params.push(departmentId);
    where.push(`(a.department_id = $${params.length} OR a.department_id IS NULL)`);
  }

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const countResult = await query(`SELECT COUNT(*) FROM announcements a ${whereClause}`, params);

  const dataParams = [...params, limit, offset];
  const result = await query(
    `SELECT a.*, d.name AS department_name,
            u.first_name AS author_first_name, u.last_name AS author_last_name
     FROM announcements a
     LEFT JOIN departments d ON d.id = a.department_id
     JOIN users u ON u.id = a.created_by
     ${whereClause}
     ORDER BY
       CASE a.priority WHEN 'urgent' THEN 1 WHEN 'important' THEN 2 ELSE 3 END,
       a.published_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );
  return { announcements: result.rows, total: parseInt(countResult.rows[0].count) };
};

export const getAnnouncementById = async (id) => {
  const result = await query(
    `SELECT a.*, d.name AS department_name,
            u.first_name AS author_first_name, u.last_name AS author_last_name
     FROM announcements a
     LEFT JOIN departments d ON d.id = a.department_id
     JOIN users u ON u.id = a.created_by
     WHERE a.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('Announcement not found.', 404);
  return result.rows[0];
};

export const createAnnouncement = async ({ title, description, departmentId, priority, expiresAt, createdBy }) => {
  const result = await query(
    `INSERT INTO announcements (title, description, department_id, priority, expires_at, created_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, departmentId || null, priority || 'normal', expiresAt || null, createdBy]
  );
  return result.rows[0];
};

export const updateAnnouncement = async (id, userId, role, fields) => {
  const existing = await query('SELECT * FROM announcements WHERE id = $1', [id]);
  if (!existing.rows.length) throw new AppError('Announcement not found.', 404);
  if (role !== 'admin' && existing.rows[0].created_by !== userId) {
    throw new AppError('You can only edit your own announcements.', 403);
  }
  const { title, description, departmentId, priority, expiresAt, isActive } = fields;
  const result = await query(
    `UPDATE announcements SET
       title         = COALESCE($1, title),
       description   = COALESCE($2, description),
       department_id = COALESCE($3, department_id),
       priority      = COALESCE($4, priority),
       expires_at    = COALESCE($5, expires_at),
       is_active     = COALESCE($6, is_active),
       updated_at    = NOW()
     WHERE id = $7 RETURNING *`,
    [title||null, description||null, departmentId||null, priority||null, expiresAt||null, isActive??null, id]
  );
  return result.rows[0];
};

export const deleteAnnouncement = async (id) => {
  await query('DELETE FROM announcements WHERE id = $1', [id]);
};
