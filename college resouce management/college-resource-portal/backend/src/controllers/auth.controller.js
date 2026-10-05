import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, departmentId, semester, rollNumber, employeeId } = req.body;
    const user = await authService.registerUser({ email, password, role, firstName, lastName, departmentId, semester, rollNumber, employeeId });
    return sendSuccess(res, { user }, 201, 'Registration successful.');
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    return sendSuccess(res, data, 200, 'Login successful.');
  } catch (err) { next(err); }
};

export const logout = (_req, res) => {
  // JWT is stateless; client drops the token.
  return sendSuccess(res, null, 200, 'Logged out successfully.');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    return sendSuccess(res, { user });
  } catch (err) { next(err); }
};

export const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, bio, semester, avatarUrl } = req.body;
    const user = await authService.updateUserProfile(req.user.id, { firstName, lastName, phone, bio, semester, avatarUrl });
    return sendSuccess(res, { user }, 200, 'Profile updated.');
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return sendSuccess(res, null, 200, 'Password changed successfully.');
  } catch (err) { next(err); }
};
