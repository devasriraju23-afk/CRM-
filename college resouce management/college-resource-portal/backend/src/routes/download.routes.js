import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { sendPaginated } from '../utils/response.js';
import * as downloadService from '../services/download.service.js';

const router = Router();
router.use(authenticateUser);

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { downloads, total } = await downloadService.getUserDownloads(req.user.id, { page: +page, limit: +limit });
    return sendPaginated(res, downloads, total, page, limit);
  } catch (err) { next(err); }
});

export default router;
