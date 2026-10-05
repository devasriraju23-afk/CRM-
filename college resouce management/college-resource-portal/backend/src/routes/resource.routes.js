import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth.middleware.js';
import { uploadResourceFiles } from '../middleware/upload.middleware.js';
import { validate } from '../validators/validate.js';
import { createResourceValidator, updateResourceValidator, resourceQueryValidator } from '../validators/resource.validators.js';
import * as ctrl from '../controllers/resource.controller.js';

const router = Router();

// All resource routes require auth
router.use(authenticateUser);

router.get('/',     resourceQueryValidator, validate, ctrl.getResources);
router.get('/:id',  ctrl.getResourceById);
router.get('/:id/download', ctrl.downloadResource);

router.post('/',
  authorizeRole('faculty', 'admin'),
  uploadResourceFiles,
  createResourceValidator, validate,
  ctrl.createResource
);

router.put('/:id',
  authorizeRole('faculty', 'admin'),
  updateResourceValidator, validate,
  ctrl.updateResource
);

router.delete('/:id',
  authorizeRole('faculty', 'admin'),
  ctrl.deleteResource
);

export default router;
