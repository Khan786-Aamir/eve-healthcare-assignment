import { body } from 'express-validator';

export const createBookingValidator = [
  body('testId').isMongoId().withMessage('Valid Test ID is required'),
  body('centreId').isMongoId().withMessage('Valid Centre ID is required'),
  body('appointmentDate').isISO8601().toDate().withMessage('Valid Appointment Date is required')
];