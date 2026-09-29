import { body } from 'express-validator';

export const createPaymentValidator = [
  body('bookingId').isMongoId().withMessage('Valid Booking ID is required')
];

export const webhookValidator = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('bookingId').isMongoId().withMessage('Valid Booking ID is required'),
  body('status').notEmpty().withMessage('Status is required')
];