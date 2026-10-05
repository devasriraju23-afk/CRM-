import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/announcement.controller.js';

const router = Router();
router.use(authenticateUser);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   authorizeRole('faculty', 'admin'), ctrl.create);
router.put('/:id', authorizeRole('faculty', 'admin'), ctrl.update);
router.delete('/:id', authorizeRole('admin'), ctrl.remove);

export default router;
