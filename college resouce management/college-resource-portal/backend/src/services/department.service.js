import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllDepartments = async () => {
  const result = await query(
    `SELECT d.*, COUNT(u.id) FILTER (WHERE u.role = 'student') AS student_count,
            COUNT(u.id) FILTER (WHERE u.role = 'faculty') AS faculty_count
     FROM departments d
     LEFT JOIN users u ON u.department_id = d.id AND u.is_active = TRUE
     WHERE d.is_active = TRUE
     GROUP BY d.id
     ORDER BY d.name`
  );
  return result.rows;
};

export const getDepartmentById = async (id) => {
  const result = await query('SELECT * FROM departments WHERE id = $1', [id]);
  if (!result.rows.length) throw new AppError('Department not found.', 404);
  return result.rows[0];
};

export const createDepartment = async ({ name, code, description, hodName }) => {
  const result = await query(
    `INSERT INTO departments (name, code, description, hod_name)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, code.toUpperCase(), description || null, hodName || null]
  );
  return result.rows[0];
};

export const updateDepartment = async (id, { name, code, description, hodName, isActive }) => {
  const result = await query(
    `UPDATE departments SET
       name      = COALESCE($1, name),
       code      = COALESCE($2, code),
       description = COALESCE($3, description),
       hod_name  = COALESCE($4, hod_name),
       is_active = COALESCE($5, is_active),
       updated_at = NOW()
     WHERE id = $6 RETURNING *`,
    [name || null, code ? code.toUpperCase() : null, description || null,
     hodName || null, isActive ?? null, id]
  );
  if (!result.rows.length) throw new AppError('Department not found.', 404);
  return result.rows[0];
};

export const deleteDepartment = async (id) => {
  const check = await query('SELECT COUNT(*) FROM users WHERE department_id = $1', [id]);
  if (parseInt(check.rows[0].count) > 0) {
    throw new AppError('Cannot delete department that has associated users.', 409);
  }
  await query('DELETE FROM departments WHERE id = $1', [id]);
};
