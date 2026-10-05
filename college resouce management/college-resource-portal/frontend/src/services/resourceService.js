import { MOCK_RESOURCES } from './mockData.js';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

const paginate = (arr, page = 1, limit = 20) => {
  const p = parseInt(page); const l = parseInt(limit);
  const total = arr.length;
  const data  = arr.slice((p - 1) * l, p * l);
  return { data, pagination: { total, page: p, limit: l, totalPages: Math.ceil(total / l) || 1 } };
};

export const getResources = async (params = {}) => {
  await delay();
  let list = [...MOCK_RESOURCES];

  const { search, department, semester, subject, type, status, sort, uploadedBy, page = 1, limit = 20 } = params;

  // role-based visibility: show all unless explicitly filtered
  if (status)      list = list.filter(r => r.status === status);
  else if (!uploadedBy) list = list.filter(r => r.status === 'approved');

  if (uploadedBy)  list = list.filter(r => r.uploader_first_name === 'Deepak' || r.uploader_first_name === 'Kavitha'); // mock: faculty sees their uploads
  if (search)      list = list.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || (r.tags||[]).some(t => t.includes(search.toLowerCase())));
  if (department)  list = list.filter(r => r.department_id === department);
  if (semester)    list = list.filter(r => r.semester === parseInt(semester));
  if (subject)     list = list.filter(r => r.subject_id === subject);
  if (type)        list = list.filter(r => r.resource_type === type);

  const sortMap = {
    newest:    (a,b) => new Date(b.created_at) - new Date(a.created_at),
    oldest:    (a,b) => new Date(a.created_at) - new Date(b.created_at),
    downloads: (a,b) => b.download_count - a.download_count,
    views:     (a,b) => b.view_count - a.view_count,
    title:     (a,b) => a.title.localeCompare(b.title),
  };
  if (sort && sortMap[sort]) list.sort(sortMap[sort]);
  else list.sort(sortMap.newest);

  const result = paginate(list, page, limit);
  return { data: result };
};

export const getResourceById = async (id) => {
  await delay();
  const resource = MOCK_RESOURCES.find(r => r.id === id);
  if (!resource) throw new Error('Resource not found');
  return { data: { success: true, data: { resource: { ...resource, is_bookmarked: false } } } };
};

export const createResource = async (formData) => {
  await delay(600);
  return { data: { success: true, message: 'Resource uploaded! Awaiting admin approval.' } };
};

export const updateResource = async (id, data) => {
  await delay(400);
  return { data: { success: true, message: 'Resource updated.' } };
};

export const deleteResource = async (id) => {
  await delay(300);
  return { data: { success: true, message: 'Resource deleted.' } };
};

export const downloadResource = async (id) => {
  await delay(300);
  const resource = MOCK_RESOURCES.find(r => r.id === id);
  return { data: { success: true, data: { fileUrl: '#', title: resource?.title || 'Resource' } } };
};
