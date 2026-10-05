import * as deptService from '../services/department.service.js';
import { sendSuccess } from '../utils/response.js';

export const getAll    = async (req, res, next) => { try { const data = await deptService.getAllDepartments();             return sendSuccess(res, { departments: data }); } catch (e) { next(e); } };
export const getById   = async (req, res, next) => { try { const data = await deptService.getDepartmentById(req.params.id); return sendSuccess(res, { department: data }); } catch (e) { next(e); } };
export const create    = async (req, res, next) => { try { const { name, code, description, hodName } = req.body; const data = await deptService.createDepartment({ name, code, description, hodName }); return sendSuccess(res, { department: data }, 201, 'Department created.'); } catch (e) { next(e); } };
export const update    = async (req, res, next) => { try { const data = await deptService.updateDepartment(req.params.id, req.body); return sendSuccess(res, { department: data }, 200, 'Department updated.'); } catch (e) { next(e); } };
export const remove    = async (req, res, next) => { try { await deptService.deleteDepartment(req.params.id); return sendSuccess(res, null, 200, 'Department deleted.'); } catch (e) { next(e); } };
