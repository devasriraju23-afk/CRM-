import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { query } from '../config/database.js';
import { sendError } from '../utils/response.js';

/**
 * Verify JWT and attach req.user = { id, email, role, firstName, lastName }
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch {
      return sendError(res, 'Invalid or expired token. Please log in again.', 401);
    }

    const result = await query(
      'SELECT id, email, role, first_name, last_name, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!result.rows.length) {
      return sendError(res, 'User not found.', 401);
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return sendError(res, 'Your account has been deactivated. Contact admin.', 403);
    }

    req.user = {
      id:        user.id,
      email:     user.email,
      role:      user.role,
      firstName: user.first_name,
      lastName:  user.last_name,
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Restrict access to one or more roles.
 * Usage: authorizeRole('admin') | authorizeRole('faculty', 'admin')
 */
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action.', 403);
    }
    next();
  };
};
