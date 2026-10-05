import * as subjectService from '../services/subject.service.js';
import { sendSuccess } from '../utils/response.js';

export const getAll  = async (req, res, next) => { try { const data = await subjectService.getAllSubjects(req.query);           return sendSuccess(res, { subjects: data }); } catch (e) { next(e); } };
export const getById = async (req, res, next) => { try { const data = await subjectService.getSubjectById(req.params.id);       return sendSuccess(res, { subject: data }); } catch (e) { next(e); } };
export const create  = async (req, res, next) => { try { const data = await subjectService.createSubject(req.body);              return sendSuccess(res, { subject: data }, 201, 'Subject created.'); } catch (e) { next(e); } };
export const update  = async (req, res, next) => { try { const data = await subjectService.updateSubject(req.params.id, req.body); return sendSuccess(res, { subject: data }, 200, 'Subject updated.'); } catch (e) { next(e); } };
export const remove  = async (req, res, next) => { try { await subjectService.deleteSubject(req.params.id);                    return sendSuccess(res, null, 200, 'Subject deleted.'); } catch (e) { next(e); } };
