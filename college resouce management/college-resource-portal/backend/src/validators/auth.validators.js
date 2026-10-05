import { body } from 'express-validator';

export const registerValidator = [
  body('email')
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
  body('firstName')
    .trim().notEmpty().withMessage('First name is required.')
    .isLength({ max: 100 }).withMessage('First name must be under 100 characters.'),
  body('lastName')
    .trim().notEmpty().withMessage('Last name is required.')
    .isLength({ max: 100 }).withMessage('Last name must be under 100 characters.'),
  body('role')
    .isIn(['student', 'faculty']).withMessage('Role must be student or faculty.'),
  body('departmentId')
    .optional().isUUID().withMessage('Invalid department ID.'),
  body('semester')
    .optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8.'),
  body('rollNumber')
    .optional().trim().isLength({ max: 50 }),
  body('employeeId')
    .optional().trim().isLength({ max: 50 }),
];

export const loginValidator = [
  body('email')
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

export const updateProfileValidator = [
  body('firstName')
    .optional().trim().notEmpty().withMessage('First name cannot be empty.')
    .isLength({ max: 100 }),
  body('lastName')
    .optional().trim().notEmpty().withMessage('Last name cannot be empty.')
    .isLength({ max: 100 }),
  body('phone')
    .optional().trim().isLength({ max: 20 }),
  body('bio')
    .optional().trim().isLength({ max: 500 }),
  body('semester')
    .optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be 1–8.'),
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter.')
    .matches(/[0-9]/).withMessage('Must contain a number.'),
];
