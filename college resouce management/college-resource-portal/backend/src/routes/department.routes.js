import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/department.controller.js';

const router = Router();

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',    authenticateUser, authorizeRole('admin'), ctrl.create);
router.put('/:id',  authenticateUser, authorizeRole('admin'), ctrl.update);
router.delete('/:id', authenticateUser, authorizeRole('admin'), ctrl.remove);

export default router;
