import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from './notification.service.js';
import { logger } from '../utils/logger.js';

// ── User management ───────────────────────────────────────────────────────────

export const getUsers = async ({ role, search, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const where  = [];

  if (role)   { params.push(role);   where.push(`u.role = $${params.length}`); }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const countResult = await query(`SELECT COUNT(*) FROM users u ${whereClause}`, params);

  const dataParams = [...params, limit, offset];
  const result = await query(
    `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.is_active,
            u.last_login, u.created_at, u.semester, u.roll_number, u.employee_id,
            d.name AS department_name, d.code AS department_code
     FROM users u
     LEFT JOIN departments d ON d.id = u.department_id
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );
  return { users: result.rows, total: parseInt(countResult.rows[0].count) };
};

export const getUserById = async (id) => {
  const result = await query(
    `SELECT u.*, d.name AS department_name FROM users u
     LEFT JOIN departments d ON d.id = u.department_id WHERE u.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('User not found.', 404);
  const { password_hash: _, ...user } = result.rows[0];
  return user;
};

export const updateUser = async (id, { role, isActive, departmentId }) => {
  const result = await query(
    `UPDATE users SET
       role          = COALESCE($1, role),
       is_active     = COALESCE($2, is_active),
       department_id = COALESCE($3, department_id),
       updated_at    = NOW()
     WHERE id = $4
     RETURNING id, email, role, first_name, last_name, is_active, department_id`,
    [role||null, isActive??null, departmentId||null, id]
  );
  if (!result.rows.length) throw new AppError('User not found.', 404);
  return result.rows[0];
};

export const deleteUser = async (id, adminId) => {
  if (id === adminId) throw new AppError('You cannot delete your own account.', 400);
  await query('DELETE FROM users WHERE id = $1', [id]);
  logger.info(`Admin ${adminId} deleted user ${id}`);
};

// ── Resource approvals ────────────────────────────────────────────────────────

export const getPendingResources = async ({ status = 'pending', page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const countResult = await query(
    `SELECT COUNT(*) FROM resources WHERE status = $1`, [status]
  );
  const result = await query(
    `SELECT r.id, r.title, r.resource_type, r.file_type, r.file_size,
            r.status, r.created_at, r.rejection_reason,
            d.name AS department_name,
            s.name AS subject_name,
            u.first_name AS uploader_first_name, u.last_name AS uploader_last_name,
            u.email AS uploader_email
     FROM resources r
     JOIN departments d ON d.id = r.department_id
     LEFT JOIN subjects s ON s.id = r.subject_id
     JOIN users u ON u.id = r.uploaded_by
     WHERE r.status = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );
  return { resources: result.rows, total: parseInt(countResult.rows[0].count) };
};

export const approveResource = async (id, adminId) => {
  const resource = await query('SELECT * FROM resources WHERE id = $1', [id]);
  if (!resource.rows.length) throw new AppError('Resource not found.', 404);

  await query(
    `UPDATE resources SET status = 'approved', rejection_reason = NULL, updated_at = NOW() WHERE id = $1`,
    [id]
  );

  // Notify uploader
  await createNotification({
    userId:      resource.rows[0].uploaded_by,
    title:       'Resource Approved',
    message:     `Your resource "${resource.rows[0].title}" has been approved and is now visible to students.`,
    type:        'approval',
    referenceId: id,
  });

  logger.info(`Admin ${adminId} approved resource ${id}`);
  return resource.rows[0];
};

export const rejectResource = async (id, adminId, reason) => {
  if (!reason?.trim()) throw new AppError('Rejection reason is required.', 400);

  const resource = await query('SELECT * FROM resources WHERE id = $1', [id]);
  if (!resource.rows.length) throw new AppError('Resource not found.', 404);

  await query(
    `UPDATE resources SET status = 'rejected', rejection_reason = $1, updated_at = NOW() WHERE id = $2`,
    [reason, id]
  );

  await createNotification({
    userId:      resource.rows[0].uploaded_by,
    title:       'Resource Rejected',
    message:     `Your resource "${resource.rows[0].title}" was rejected. Reason: ${reason}`,
    type:        'rejection',
    referenceId: id,
  });

  logger.info(`Admin ${adminId} rejected resource ${id}`);
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const getAnalytics = async () => {
  const [
    totalUsers,
    totalResources,
    totalDownloads,
    pendingApprovals,
    resourcesByDept,
    resourcesByType,
    mostDownloaded,
    recentUploads,
    activeUsers,
    monthlyDownloads,
    monthlyUploads,
  ] = await Promise.all([
    query(`SELECT
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE role = 'student') AS students,
             COUNT(*) FILTER (WHERE role = 'faculty') AS faculty,
             COUNT(*) FILTER (WHERE role = 'admin')   AS admins
           FROM users WHERE is_active = TRUE`),

    query(`SELECT
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE status = 'approved') AS approved,
             COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
             COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
           FROM resources`),

    query('SELECT COUNT(*) AS total FROM downloads'),

    query(`SELECT COUNT(*) AS total FROM resources WHERE status = 'pending'`),

    query(`SELECT d.name AS department, COUNT(r.id) AS count
           FROM resources r JOIN departments d ON d.id = r.department_id
           WHERE r.status = 'approved'
           GROUP BY d.name ORDER BY count DESC`),

    query(`SELECT resource_type AS type, COUNT(*) AS count
           FROM resources WHERE status = 'approved'
           GROUP BY resource_type ORDER BY count DESC`),

    query(`SELECT r.id, r.title, r.download_count, r.view_count,
                  d.name AS department_name, r.resource_type
           FROM resources r JOIN departments d ON d.id = r.department_id
           WHERE r.status = 'approved'
           ORDER BY r.download_count DESC LIMIT 10`),

    query(`SELECT r.id, r.title, r.resource_type, r.status, r.created_at,
                  u.first_name AS uploader_first_name, u.last_name AS uploader_last_name,
                  d.name AS department_name
           FROM resources r
           JOIN users u ON u.id = r.uploaded_by
           JOIN departments d ON d.id = r.department_id
           ORDER BY r.created_at DESC LIMIT 10`),

    query(`SELECT COUNT(DISTINCT user_id) AS count FROM downloads
           WHERE downloaded_at > NOW() - INTERVAL '30 days'`),

    query('SELECT * FROM get_monthly_downloads(6)'),
    query('SELECT * FROM get_monthly_uploads(6)'),
  ]);

  return {
    users:           totalUsers.rows[0],
    resources:       totalResources.rows[0],
    downloads:       totalDownloads.rows[0],
    pendingApprovals: parseInt(pendingApprovals.rows[0].total),
    resourcesByDept: resourcesByDept.rows,
    resourcesByType: resourcesByType.rows,
    mostDownloaded:  mostDownloaded.rows,
    recentUploads:   recentUploads.rows,
    activeUsers:     parseInt(activeUsers.rows[0].count),
    monthlyDownloads: monthlyDownloads.rows,
    monthlyUploads:   monthlyUploads.rows,
  };
};
