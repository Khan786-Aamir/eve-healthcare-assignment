import { body } from 'express-validator';

export const createTestValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('centreId').isMongoId().withMessage('Valid Centre ID is required')
];