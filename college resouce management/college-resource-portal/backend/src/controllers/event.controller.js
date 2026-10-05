import * as eventService from '../services/event.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, upcoming, departmentId } = req.query;
    const { events, total } = await eventService.getEvents({ upcoming, departmentId, page: +page, limit: +limit });
    return sendPaginated(res, events, total, page, limit);
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const data = await eventService.getEventById(req.params.id);
    return sendSuccess(res, { event: data });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { name, description, eventDate, eventTime, venue, departmentId, organizer, registrationLink } = req.body;
    const data = await eventService.createEvent({ name, description, eventDate, eventTime, venue, departmentId, organizer, registrationLink, createdBy: req.user.id });
    return sendSuccess(res, { event: data }, 201, 'Event created.');
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await eventService.updateEvent(req.params.id, req.body);
    return sendSuccess(res, { event: data }, 200, 'Event updated.');
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);
    return sendSuccess(res, null, 200, 'Event deleted.');
  } catch (err) { next(err); }
};
