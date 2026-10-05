import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/bookmark.controller.js';

const router = Router();
router.use(authenticateUser);

router.get('/',                      ctrl.getBookmarks);
router.post('/:resourceId',          ctrl.addBookmark);
router.delete('/:resourceId',        ctrl.removeBookmark);

export default router;
