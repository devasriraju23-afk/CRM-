import { query } from '../config/database.js';

export const getUserDownloads = async (userId, { page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const count  = await query('SELECT COUNT(*) FROM downloads WHERE user_id = $1', [userId]);
  const result = await query(
    `SELECT d.id AS download_id, d.downloaded_at,
            r.id, r.title, r.resource_type, r.file_type, r.file_size, r.thumbnail_url,
            dep.name AS department_name, dep.code AS department_code,
            s.name AS subject_name,
            u.first_name AS uploader_first_name, u.last_name AS uploader_last_name
     FROM downloads d
     JOIN resources r ON r.id = d.resource_id
     JOIN departments dep ON dep.id = r.department_id
     LEFT JOIN subjects s ON s.id = r.subject_id
     JOIN users u ON u.id = r.uploaded_by
     WHERE d.user_id = $1
     ORDER BY d.downloaded_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return { downloads: result.rows, total: parseInt(count.rows[0].count) };
};
