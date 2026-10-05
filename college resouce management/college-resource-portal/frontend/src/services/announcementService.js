import { MOCK_ANNOUNCEMENTS } from './mockData.js';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));
let announcements = [...MOCK_ANNOUNCEMENTS];

const paginate = (arr, page, limit) => {
  const p = parseInt(page), l = parseInt(limit);
  return { data: arr.slice((p-1)*l, p*l), pagination: { total: arr.length, page: p, limit: l, totalPages: Math.ceil(arr.length/l)||1 } };
};

export const getAnnouncements = async (params = {}) => {
  await delay();
  const { page = 1, limit = 15 } = params;
  const sorted = [...announcements].sort((a,b) => {
    const pri = { urgent:1, important:2, normal:3 };
    return (pri[a.priority]||3) - (pri[b.priority]||3);
  });
  const result = paginate(sorted, page, limit);
  return { data: result };
};

export const getAnnouncementById = async (id) => {
  await delay();
  const ann = announcements.find(a => a.id === id);
  return { data: { success: true, data: { announcement: ann } } };
};

export const createAnnouncement = async (data) => {
  await delay(400);
  const newAnn = { id: `ann${Date.now()}`, ...data, author_first_name: 'System', author_last_name: 'Admin', published_at: new Date().toISOString(), is_active: true };
  announcements.unshift(newAnn);
  return { data: { success: true, data: { announcement: newAnn } } };
};

export const updateAnnouncement = async (id, data) => {
  await delay(300);
  announcements = announcements.map(a => a.id === id ? { ...a, ...data } : a);
  return { data: { success: true, message: 'Updated.' } };
};

export const deleteAnnouncement = async (id) => {
  await delay(300);
  announcements = announcements.filter(a => a.id !== id);
  return { data: { success: true } };
};
