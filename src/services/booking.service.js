import Booking from '../models/Booking.js';
import Centre from '../models/Centre.js';
import Test from '../models/Test.js';
import { calculateAmount } from './bookingCalculation.service.js';
import ApiError from '../utils/ApiError.js';

export const createBooking = async (userId, bookingData) => {
  const centre = await Centre.findById(bookingData.centreId);
  if (!centre) throw new ApiError(404, "Centre not found");

  const test = await Test.findById(bookingData.testId);
  if (!test) throw new ApiError(404, "Test not found");
  if (test.centreId.toString() !== centre._id.toString()) {
    throw new ApiError(400, "Test does not belong to the selected Centre");
  }

  const amount = await calculateAmount(bookingData.testId);

  return await Booking.create({
    userId,
    testId: bookingData.testId,
    centreId: bookingData.centreId,
    appointmentDate: bookingData.appointmentDate,
    amount
  });
};

export const getUserBookings = async (userId) => {
  return await Booking.find({ userId }).populate('testId centreId');
};

export const deleteBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw new ApiError(404, "Booking not found");
  await Booking.deleteOne({ _id: bookingId });
  return booking;
};