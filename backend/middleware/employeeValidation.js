import { body } from 'express-validator';

export const employeeValidation = [
    body('employeeId')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required')
        .isLength({ min: 2, max: 20 })
        .withMessage('Employee ID must be between 2 and 20 characters'),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Please enter a valid date'),

    body('attendTime')
        .trim()
        .notEmpty()
        .withMessage('Attend time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please enter a valid time in HH:MM format'),

    body('leaveTime')
        .trim()
        .notEmpty()
        .withMessage('Leave time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please enter a valid time in HH:MM format'),

    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required'),

    body('position')
        .trim()
        .notEmpty()
        .withMessage('Position is required'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive')
]; 