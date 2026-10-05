import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validate } from '../validators/validate.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from '../validators/auth.validators.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login',    authLimiter, loginValidator,    validate, authController.login);
router.post('/logout',   authenticateUser, authController.logout);
router.get( '/me',       authenticateUser, authController.getMe);
router.put( '/me',       authenticateUser, updateProfileValidator, validate, authController.updateMe);
router.put( '/me/password', authenticateUser, changePasswordValidator, validate, authController.changePassword);

export default router;
