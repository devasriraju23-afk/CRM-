import { MOCK_USERS_LIST, MOCK_DEPARTMENTS, MOCK_SUBJECTS, MOCK_RESOURCES, MOCK_ANALYTICS } from './mockData.js';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));
const paginate = (arr, page, limit) => {
  const p = parseInt(page)||1, l = parseInt(limit)||20;
  return { data: arr.slice((p-1)*l, p*l), pagination: { total: arr.length, page: p, limit: l, totalPages: Math.ceil(arr.length/l)||1 } };
};

let users   = [...MOCK_USERS_LIST];
let depts   = [...MOCK_DEPARTMENTS];
let subjects = [...MOCK_SUBJECTS];

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async ({ role, search, page=1, limit=20 } = {}) => {
  await delay();
  let list = [...users];
  if (role)   list = list.filter(u => u.role === role);
  if (search) list = list.filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  const result = paginate(list, page, limit);
  return { data: result };
};

export const getUserById = async (id) => {
  await delay();
  return { data: { success:true, data: { user: users.find(u=>u.id===id) } } };
};

export const updateUser = async (id, data) => {
  await delay(300);
  users = users.map(u => u.id===id ? { ...u, ...data, is_active: data.isActive !== undefined ? data.isActive : u.is_active } : u);
  return { data: { success:true, message:'Updated.' } };
};

export const deleteUser = async (id) => {
  await delay(300);
  users = users.filter(u => u.id !== id);
  return { data: { success:true } };
};

// ── Resources (approvals) ─────────────────────────────────────────────────────
export const getPendingResources = async ({ status='pending', page=1, limit=15 } = {}) => {
  await delay();
  let list = MOCK_RESOURCES.filter(r => r.status === status);
  const result = paginate(list, page, limit);
  return { data: result };
};

export const approveResource = async (id) => {
  await delay(300);
  return { data: { success:true, message:'Approved.' } };
};

export const rejectResource = async (id, reason) => {
  await delay(300);
  return { data: { success:true, message:'Rejected.' } };
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getAnalytics = async () => {
  await delay(400);
  return { data: { success:true, data: MOCK_ANALYTICS } };
};

export const broadcastNotif = async (data) => {
  await delay(300);
  return { data: { success:true, data: { sentTo: 9 } } };
};

// ── Departments ───────────────────────────────────────────────────────────────
export const getDepartments = async () => {
  await delay();
  return { data: { success:true, data: { departments: depts } } };
};

export const createDepartment = async (data) => {
  await delay(300);
  const d = { id:`d${Date.now()}`, ...data, code: data.code?.toUpperCase(), is_active:true, student_count:0, faculty_count:0 };
  depts.push(d);
  return { data: { success:true, data: { department: d } } };
};

export const updateDepartment = async (id, data) => {
  await delay(300);
  depts = depts.map(d => d.id===id ? { ...d, ...data } : d);
  return { data: { success:true } };
};

export const deleteDepartment = async (id) => {
  await delay(300);
  depts = depts.filter(d => d.id !== id);
  return { data: { success:true } };
};

// ── Subjects ──────────────────────────────────────────────────────────────────
export const getSubjects = async ({ departmentId } = {}) => {
  await delay();
  let list = [...subjects];
  if (departmentId) list = list.filter(s => s.department_id === departmentId);
  return { data: { success:true, data: { subjects: list } } };
};

export const createSubject = async (data) => {
  await delay(300);
  const s = { id:`s${Date.now()}`, ...data, is_active:true };
  subjects.push(s);
  return { data: { success:true, data: { subject: s } } };
};

export const updateSubject = async (id, data) => {
  await delay(300);
  subjects = subjects.map(s => s.id===id ? { ...s, ...data } : s);
  return { data: { success:true } };
};

export const deleteSubject = async (id) => {
  await delay(300);
  subjects = subjects.filter(s => s.id !== id);
  return { data: { success:true } };
};
