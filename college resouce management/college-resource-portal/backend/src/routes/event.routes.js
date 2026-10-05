import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/event.controller.js';

const router = Router();
router.use(authenticateUser);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   authorizeRole('admin'), ctrl.create);
router.put('/:id', authorizeRole('admin'), ctrl.update);
router.delete('/:id', authorizeRole('admin'), ctrl.remove);

export default router;
