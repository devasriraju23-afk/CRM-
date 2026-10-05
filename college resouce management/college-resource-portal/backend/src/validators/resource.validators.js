import { body, query, param } from 'express-validator';

export const createResourceValidator = [
  body('title')
    .trim().notEmpty().withMessage('Title is required.')
    .isLength({ max: 300 }).withMessage('Title must be under 300 characters.'),
  body('description')
    .optional().trim().isLength({ max: 2000 }),
  body('resourceType')
    .isIn(['notes','question_papers','assignments','lab_manuals','syllabus','ebooks','presentations','study_materials','other'])
    .withMessage('Invalid resource type.'),
  body('departmentId')
    .isUUID().withMessage('Valid department ID is required.'),
  body('subjectId')
    .optional({ nullable: true }).isUUID().withMessage('Invalid subject ID.'),
  body('semester')
    .optional({ nullable: true }).isInt({ min: 1, max: 8 }).withMessage('Semester must be 1–8.'),
  body('category')
    .optional().trim().isLength({ max: 100 }),
  body('tags')
    .optional().isString().withMessage('Tags must be a comma-separated string.'),
];

export const updateResourceValidator = [
  param('id').isUUID().withMessage('Invalid resource ID.'),
  body('title')
    .optional().trim().notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 300 }),
  body('description')
    .optional().trim().isLength({ max: 2000 }),
  body('category')
    .optional().trim().isLength({ max: 100 }),
  body('semester')
    .optional({ nullable: true }).isInt({ min: 1, max: 8 }),
];

export const resourceQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100.'),
  query('semester').optional().isInt({ min: 1, max: 8 }),
  query('sort')
    .optional()
    .isIn(['newest','oldest','downloads','views','title'])
    .withMessage('Invalid sort option.'),
];
