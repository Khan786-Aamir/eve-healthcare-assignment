import { body } from 'express-validator';

export const createCentreValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required')
];