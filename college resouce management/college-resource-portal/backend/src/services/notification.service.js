import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getUserNotifications = async (userId, { page = 1, limit = 20, unread } = {}) => {
  const offset = (page - 1) * limit;
  const where  = ['user_id = $1'];
  if (unread === 'true') where.push('is_read = FALSE');

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const countResult = await query(`SELECT COUNT(*) FROM notifications ${whereClause}`, [userId]);
  const unreadCount = await query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE', [userId]);

  const result = await query(
    `SELECT * FROM notifications ${whereClause}
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return {
    notifications: result.rows,
    total:         parseInt(countResult.rows[0].count),
    unreadCount:   parseInt(unreadCount.rows[0].count),
  };
};

export const markAsRead = async (id, userId) => {
  const result = await query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  if (!result.rows.length) throw new AppError('Notification not found.', 404);
  return result.rows[0];
};

export const markAllAsRead = async (userId) => {
  await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE', [userId]);
};

export const createNotification = async ({ userId, title, message, type, referenceId }) => {
  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type, reference_id)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, title, message, type, referenceId || null]
  );
  return result.rows[0];
};

/** Broadcast a notification to all users matching a role (or all users). */
export const broadcastNotification = async ({ title, message, type, role }) => {
  let userQuery = 'SELECT id FROM users WHERE is_active = TRUE';
  const params  = [];
  if (role) { params.push(role); userQuery += ` AND role = $1`; }

  const users = (await query(userQuery, params)).rows;
  for (const user of users) {
    await createNotification({ userId: user.id, title, message, type });
  }
  return users.length;
};
