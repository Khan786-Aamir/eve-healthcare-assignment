import { processPayment, handleWebhook } from '../services/payment.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const initiatePayment = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const payment = await processPayment(req.body.bookingId);
  res.status(200).json(new ApiResponse(200, payment, "Payment initiated"));
});

export const paymentWebhook = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const { eventId, bookingId, status } = req.body;
  const result = await handleWebhook(eventId, bookingId, status);
  res.status(200).json(new ApiResponse(200, result, "Webhook handled"));
});