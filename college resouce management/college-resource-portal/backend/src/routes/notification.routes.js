import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import * as notifService from '../services/notification.service.js';

const router = Router();
router.use(authenticateUser);

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const data = await notifService.getUserNotifications(req.user.id, { page: +page, limit: +limit, unread });
    return res.json({
      success: true,
      data: data.notifications,
      unreadCount: data.unreadCount,
      pagination: {
        total: data.total, page: +page, limit: +limit,
        totalPages: Math.ceil(data.total / limit),
      },
    });
  } catch (err) { next(err); }
});

router.put('/read-all', async (req, res, next) => {
  try {
    await notifService.markAllAsRead(req.user.id);
    return sendSuccess(res, null, 200, 'All notifications marked as read.');
  } catch (err) { next(err); }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id, req.user.id);
    return sendSuccess(res, { notification: notif }, 200, 'Notification marked as read.');
  } catch (err) { next(err); }
});

export default router;
