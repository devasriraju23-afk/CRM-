import * as adminService from '../services/admin.service.js';
import * as notifService from '../services/notification.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

// Users
export const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const { users, total } = await adminService.getUsers({ role, search, page: +page, limit: +limit });
    return sendPaginated(res, users, total, page, limit);
  } catch (err) { next(err); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return sendSuccess(res, { user });
  } catch (err) { next(err); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    return sendSuccess(res, { user }, 200, 'User updated.');
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    return sendSuccess(res, null, 200, 'User deleted.');
  } catch (err) { next(err); }
};

// Resources
export const getPendingResources = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const { resources, total } = await adminService.getPendingResources({ status, page: +page, limit: +limit });
    return sendPaginated(res, resources, total, page, limit);
  } catch (err) { next(err); }
};

export const approveResource = async (req, res, next) => {
  try {
    await adminService.approveResource(req.params.id, req.user.id);
    return sendSuccess(res, null, 200, 'Resource approved.');
  } catch (err) { next(err); }
};

export const rejectResource = async (req, res, next) => {
  try {
    const { reason } = req.body;
    await adminService.rejectResource(req.params.id, req.user.id, reason);
    return sendSuccess(res, null, 200, 'Resource rejected.');
  } catch (err) { next(err); }
};

// Analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics();
    return sendSuccess(res, data);
  } catch (err) { next(err); }
};

// Broadcast notification
export const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type = 'admin_message', role } = req.body;
    const count = await notifService.broadcastNotification({ title, message, type, role });
    return sendSuccess(res, { sentTo: count }, 200, `Notification sent to ${count} users.`);
  } catch (err) { next(err); }
};
