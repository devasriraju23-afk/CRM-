import { MOCK_NOTIFICATIONS } from './mockData.js';

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));
let notifications = [...MOCK_NOTIFICATIONS];

export const getNotifications = async (params = {}) => {
  await delay();
  const { page = 1, limit = 20, unread } = params;
  let list = [...notifications].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  if (unread === 'true') list = list.filter(n => !n.is_read);
  const p = parseInt(page), l = parseInt(limit);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  return {
    data: {
      data:        list.slice((p-1)*l, p*l),
      unreadCount,
      pagination:  { total: list.length, page: p, limit: l, totalPages: Math.ceil(list.length/l)||1 },
    },
  };
};

export const markAsRead = async (id) => {
  await delay();
  notifications = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
  return { data: { success: true } };
};

export const markAllAsRead = async () => {
  await delay();
  notifications = notifications.map(n => ({ ...n, is_read: true }));
  return { data: { success: true } };
};
