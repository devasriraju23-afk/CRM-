import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authenticateUser, authorizeRole('admin'));

// Users
router.get('/users',       ctrl.getUsers);
router.get('/users/:id',   ctrl.getUserById);
router.put('/users/:id',   ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

// Resources
router.get('/resources',                    ctrl.getPendingResources);
router.put('/resources/:id/approve',        ctrl.approveResource);
router.put('/resources/:id/reject',         ctrl.rejectResource);

// Analytics
router.get('/analytics',                    ctrl.getAnalytics);

// Notifications broadcast
router.post('/notifications/broadcast',     ctrl.broadcastNotification);

export default router;
