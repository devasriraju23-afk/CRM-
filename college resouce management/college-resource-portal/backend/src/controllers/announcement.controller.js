import * as announcementService from '../services/announcement.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, departmentId } = req.query;
    const { announcements, total } = await announcementService.getAnnouncements({ departmentId, page: +page, limit: +limit });
    return sendPaginated(res, announcements, total, page, limit);
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const data = await announcementService.getAnnouncementById(req.params.id);
    return sendSuccess(res, { announcement: data });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, departmentId, priority, expiresAt } = req.body;
    const data = await announcementService.createAnnouncement({ title, description, departmentId, priority, expiresAt, createdBy: req.user.id });
    return sendSuccess(res, { announcement: data }, 201, 'Announcement created.');
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await announcementService.updateAnnouncement(req.params.id, req.user.id, req.user.role, req.body);
    return sendSuccess(res, { announcement: data }, 200, 'Announcement updated.');
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    return sendSuccess(res, null, 200, 'Announcement deleted.');
  } catch (err) { next(err); }
};
