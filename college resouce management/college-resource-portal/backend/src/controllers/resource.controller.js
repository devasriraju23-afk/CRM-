import * as resourceService from '../services/resource.service.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

export const getResources = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, department, semester, subject, type, status, sort } = req.query;
    const { resources, total } = await resourceService.getResources({
      search, department, semester, subject, type, status, sort, page, limit,
      forRole: req.user?.role,
      uploadedBy: req.query.uploadedBy,
    });
    return sendPaginated(res, resources, total, page, limit);
  } catch (err) { next(err); }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id, req.user?.id);
    return sendSuccess(res, { resource });
  } catch (err) { next(err); }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(
      { ...req.body, uploadedBy: req.user.id },
      req.files
    );
    return sendSuccess(res, { resource }, 201, 'Resource uploaded successfully. Pending admin approval.');
  } catch (err) { next(err); }
};

export const updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.user.id, req.user.role, req.body);
    return sendSuccess(res, { resource }, 200, 'Resource updated.');
  } catch (err) { next(err); }
};

export const deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id, req.user.id, req.user.role);
    return sendSuccess(res, null, 200, 'Resource deleted.');
  } catch (err) { next(err); }
};

export const downloadResource = async (req, res, next) => {
  try {
    const resource = await resourceService.downloadResource(req.params.id, req.user.id, req.ip);
    return sendSuccess(res, { fileUrl: resource.file_url, title: resource.title });
  } catch (err) { next(err); }
};
