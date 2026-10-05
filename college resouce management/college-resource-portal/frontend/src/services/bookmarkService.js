import { MOCK_RESOURCES } from './mockData.js';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));
let bookmarkedIds = new Set(['r1', 'r4']); // pre-seeded bookmarks

export const getBookmarks = async (params = {}) => {
  await delay();
  const { page = 1, limit = 12 } = params;
  const list = MOCK_RESOURCES.filter(r => bookmarkedIds.has(r.id));
  const p = parseInt(page), l = parseInt(limit);
  return {
    data: {
      data: list.slice((p-1)*l, p*l),
      pagination: { total: list.length, page: p, limit: l, totalPages: Math.ceil(list.length/l)||1 },
    },
  };
};

export const addBookmark = async (id) => {
  await delay(200);
  bookmarkedIds.add(id);
  return { data: { success: true, message: 'Bookmarked!' } };
};

export const removeBookmark = async (id) => {
  await delay(200);
  bookmarkedIds.delete(id);
  return { data: { success: true, message: 'Bookmark removed.' } };
};
