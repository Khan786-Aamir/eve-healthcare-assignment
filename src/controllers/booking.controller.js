import { createBooking, getUserBookings, deleteBooking } from '../services/booking.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const bookTest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation Error", errors.array());
  
  const booking = await createBooking(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await getUserBookings(req.user._id);
  res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export const removeBooking = catchAsync(async (req, res) => {
  await deleteBooking(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, "Booking deleted successfully"));
});