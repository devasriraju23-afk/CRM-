import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllSubjects = async ({ departmentId, semester } = {}) => {
  let sql = `SELECT s.*, d.name AS department_name, d.code AS department_code
             FROM subjects s JOIN departments d ON d.id = s.department_id
             WHERE s.is_active = TRUE`;
  const params = [];
  if (departmentId) { params.push(departmentId); sql += ` AND s.department_id = $${params.length}`; }
  if (semester)     { params.push(semester);     sql += ` AND s.semester = $${params.length}`; }
  sql += ' ORDER BY s.semester, s.name';
  const result = await query(sql, params);
  return result.rows;
};

export const getSubjectById = async (id) => {
  const result = await query(
    `SELECT s.*, d.name AS department_name FROM subjects s
     JOIN departments d ON d.id = s.department_id WHERE s.id = $1`,
    [id]
  );
  if (!result.rows.length) throw new AppError('Subject not found.', 404);
  return result.rows[0];
};

export const createSubject = async ({ name, code, departmentId, semester, credits, description }) => {
  const result = await query(
    `INSERT INTO subjects (name, code, department_id, semester, credits, description)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [name, code.toUpperCase(), departmentId, semester, credits || null, description || null]
  );
  return result.rows[0];
};

export const updateSubject = async (id, fields) => {
  const { name, code, semester, credits, description, isActive } = fields;
  const result = await query(
    `UPDATE subjects SET
       name        = COALESCE($1, name),
       code        = COALESCE($2, code),
       semester    = COALESCE($3, semester),
       credits     = COALESCE($4, credits),
       description = COALESCE($5, description),
       is_active   = COALESCE($6, is_active),
       updated_at  = NOW()
     WHERE id = $7 RETURNING *`,
    [name||null, code?code.toUpperCase():null, semester||null, credits||null, description||null, isActive??null, id]
  );
  if (!result.rows.length) throw new AppError('Subject not found.', 404);
  return result.rows[0];
};

export const deleteSubject = async (id) => {
  await query('UPDATE subjects SET is_active = FALSE WHERE id = $1', [id]);
};
