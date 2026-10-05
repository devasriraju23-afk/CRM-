import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getUserBookmarks = async (userId, { page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const count  = await query('SELECT COUNT(*) FROM bookmarks WHERE user_id = $1', [userId]);
  const result = await query(
    `SELECT b.id AS bookmark_id, b.created_at AS bookmarked_at,
            r.id, r.title, r.resource_type, r.file_type, r.file_size,
            r.download_count, r.view_count, r.thumbnail_url, r.created_at,
            d.name AS department_name, d.code AS department_code,
            s.name AS subject_name,
            u.first_name AS uploader_first_name, u.last_name AS uploader_last_name
     FROM bookmarks b
     JOIN resources r ON r.id = b.resource_id
     JOIN departments d ON d.id = r.department_id
     LEFT JOIN subjects s ON s.id = r.subject_id
     JOIN users u ON u.id = r.uploaded_by
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return { bookmarks: result.rows, total: parseInt(count.rows[0].count) };
};

export const addBookmark = async (userId, resourceId) => {
  const resource = await query('SELECT id FROM resources WHERE id = $1 AND status = $2', [resourceId, 'approved']);
  if (!resource.rows.length) throw new AppError('Resource not found.', 404);

  const existing = await query('SELECT id FROM bookmarks WHERE user_id = $1 AND resource_id = $2', [userId, resourceId]);
  if (existing.rows.length) throw new AppError('Resource is already bookmarked.', 409);

  const result = await query(
    'INSERT INTO bookmarks (user_id, resource_id) VALUES ($1,$2) RETURNING *',
    [userId, resourceId]
  );
  return result.rows[0];
};

export const removeBookmark = async (userId, resourceId) => {
  const result = await query(
    'DELETE FROM bookmarks WHERE user_id = $1 AND resource_id = $2 RETURNING id',
    [userId, resourceId]
  );
  if (!result.rows.length) throw new AppError('Bookmark not found.', 404);
};
