import * as bookmarkService from '../services/bookmark.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { bookmarks, total } = await bookmarkService.getUserBookmarks(req.user.id, { page: +page, limit: +limit });
    return sendPaginated(res, bookmarks, total, page, limit);
  } catch (err) { next(err); }
};

export const addBookmark = async (req, res, next) => {
  try {
    const bookmark = await bookmarkService.addBookmark(req.user.id, req.params.resourceId);
    return sendSuccess(res, { bookmark }, 201, 'Bookmarked successfully.');
  } catch (err) { next(err); }
};

export const removeBookmark = async (req, res, next) => {
  try {
    await bookmarkService.removeBookmark(req.user.id, req.params.resourceId);
    return sendSuccess(res, null, 200, 'Bookmark removed.');
  } catch (err) { next(err); }
};
