import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getEvents = async ({ upcoming, departmentId, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const where  = ['e.is_active = TRUE'];

  if (upcoming === 'true') {
    where.push('e.event_date >= CURRENT_DATE');
  } else if (upcoming === 'false') {
    where.push('e.event_date < CURRENT_DATE');
  }

  if (departmentId) {
    params.push(departmentId);
    where.push(`(e.department_id = $${params.length} OR e.department_id IS NULL)`);
  }

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const countResult = await query(`SELECT COUNT(*) FROM events e ${whereClause}`, params);

  const dataParams = [...params, limit, offset];
  const orderBy    = upcoming === 'false' ? 'e.event_date DESC' : 'e.event_date ASC';

  const result = await query(
    `SELECT e.*, d.name AS department_name,
            u.first_name AS creator_first_name, u.last_name AS creator_last_name
     FROM events e
     LEFT JOIN departments d ON d.id = e.department_id
     JOIN users u ON u.id = e.created_by
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );
  return { events: result.rows, total: parseInt(countResult.rows[0].count) };
};

export const getEventById = async (id) => {
  const result = await query(
    `SELECT e.*, d.name AS department_name,
            u.first_name AS creator_first_name, u.last_name AS creator_last_name
     FROM events e
     LEFT JOIN departments d ON d.id = e.department_id
     JOIN users u ON u.id = e.created_by
     WHERE e.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('Event not found.', 404);
  return result.rows[0];
};

export const createEvent = async ({ name, description, eventDate, eventTime, venue, departmentId, organizer, registrationLink, createdBy }) => {
  const result = await query(
    `INSERT INTO events (name, description, event_date, event_time, venue, department_id, organizer, registration_link, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [name, description||null, eventDate, eventTime||null, venue||null, departmentId||null, organizer||null, registrationLink||null, createdBy]
  );
  return result.rows[0];
};

export const updateEvent = async (id, fields) => {
  const { name, description, eventDate, eventTime, venue, departmentId, organizer, registrationLink, isActive } = fields;
  const result = await query(
    `UPDATE events SET
       name              = COALESCE($1, name),
       description       = COALESCE($2, description),
       event_date        = COALESCE($3, event_date),
       event_time        = COALESCE($4, event_time),
       venue             = COALESCE($5, venue),
       department_id     = COALESCE($6, department_id),
       organizer         = COALESCE($7, organizer),
       registration_link = COALESCE($8, registration_link),
       is_active         = COALESCE($9, is_active),
       updated_at        = NOW()
     WHERE id = $10 RETURNING *`,
    [name||null, description||null, eventDate||null, eventTime||null, venue||null,
     departmentId||null, organizer||null, registrationLink||null, isActive??null, id]
  );
  if (!result.rows.length) throw new AppError('Event not found.', 404);
  return result.rows[0];
};

export const deleteEvent = async (id) => {
  await query('DELETE FROM events WHERE id = $1', [id]);
};
