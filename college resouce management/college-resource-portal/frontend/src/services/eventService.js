import { MOCK_EVENTS } from './mockData.js';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));
let events = [...MOCK_EVENTS];

export const getEvents = async (params = {}) => {
  await delay();
  const { upcoming, page = 1, limit = 12 } = params;
  const today = new Date().toISOString().split('T')[0];
  let list = [...events];
  if (upcoming === 'true')  list = list.filter(e => e.event_date >= today).sort((a,b)=>a.event_date.localeCompare(b.event_date));
  else if (upcoming === 'false') list = list.filter(e => e.event_date < today).sort((a,b)=>b.event_date.localeCompare(a.event_date));
  const p = parseInt(page), l = parseInt(limit);
  return { data: { data: list.slice((p-1)*l, p*l), pagination: { total: list.length, page: p, limit: l, totalPages: Math.ceil(list.length/l)||1 } } };
};

export const getEventById = async (id) => {
  await delay();
  return { data: { success: true, data: { event: events.find(e => e.id === id) } } };
};

export const createEvent = async (data) => {
  await delay(400);
  const newEv = { id: `ev${Date.now()}`, ...data, creator_first_name: 'System', creator_last_name: 'Admin', is_active: true, created_at: new Date().toISOString() };
  events.unshift(newEv);
  return { data: { success: true, data: { event: newEv } } };
};

export const updateEvent = async (id, data) => {
  await delay(300);
  events = events.map(e => e.id === id ? { ...e, ...data } : e);
  return { data: { success: true } };
};

export const deleteEvent = async (id) => {
  await delay(300);
  events = events.filter(e => e.id !== id);
  return { data: { success: true } };
};
