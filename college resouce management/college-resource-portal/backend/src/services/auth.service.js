import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = 12;

export const registerUser = async ({ email, password, role, firstName, lastName, departmentId, semester, rollNumber, employeeId }) => {
  // Check existing email
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users
       (email, password_hash, role, first_name, last_name, department_id,
        semester, roll_number, employee_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, email, role, first_name, last_name, department_id, semester, roll_number, employee_id, created_at`,
    [email, passwordHash, role, firstName, lastName,
     departmentId || null, semester || null, rollNumber || null, employeeId || null]
  );

  const user = result.rows[0];
  logger.info(`New user registered: ${email} [${role}]`);
  return user;
};

export const loginUser = async ({ email, password }) => {
  const result = await query(
    `SELECT u.*, d.name AS department_name, d.code AS department_code
     FROM users u
     LEFT JOIN departments d ON d.id = u.department_id
     WHERE u.email = $1`,
    [email]
  );

  if (!result.rows.length) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new AppError('Your account has been deactivated. Please contact the administrator.', 403);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Update last login
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  logger.info(`User logged in: ${email} [${user.role}]`);

  // Strip password hash before returning
  const { password_hash: _, ...safeUser } = user;
  return { token, user: safeUser };
};

export const getUserById = async (userId) => {
  const result = await query(
    `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.department_id,
            u.semester, u.roll_number, u.employee_id, u.avatar_url, u.bio,
            u.phone, u.is_active, u.last_login, u.created_at,
            d.name AS department_name, d.code AS department_code
     FROM users u
     LEFT JOIN departments d ON d.id = u.department_id
     WHERE u.id = $1`,
    [userId]
  );
  if (!result.rows.length) throw new AppError('User not found.', 404);
  return result.rows[0];
};

export const updateUserProfile = async (userId, updates) => {
  const { firstName, lastName, phone, bio, semester, avatarUrl } = updates;

  const result = await query(
    `UPDATE users SET
       first_name = COALESCE($1, first_name),
       last_name  = COALESCE($2, last_name),
       phone      = COALESCE($3, phone),
       bio        = COALESCE($4, bio),
       semester   = COALESCE($5, semester),
       avatar_url = COALESCE($6, avatar_url),
       updated_at = NOW()
     WHERE id = $7
     RETURNING id, email, role, first_name, last_name, department_id,
               semester, roll_number, employee_id, avatar_url, bio, phone`,
    [firstName || null, lastName || null, phone || null, bio || null,
     semester  || null, avatarUrl || null, userId]
  );
  if (!result.rows.length) throw new AppError('User not found.', 404);
  return result.rows[0];
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  if (!result.rows.length) throw new AppError('User not found.', 404);

  const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!isMatch) throw new AppError('Current password is incorrect.', 400);

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);
  logger.info(`Password changed for user: ${userId}`);
};
