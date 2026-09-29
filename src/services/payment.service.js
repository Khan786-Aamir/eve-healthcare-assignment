import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import WebhookEvent from '../models/WebhookEvent.js';
import { simulatePayment } from '../utils/paymentSimulator.js';
import ApiError from '../utils/ApiError.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/index.js';

export const processPayment = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  const status = simulatePayment();
  const transactionId = new mongoose.Types.ObjectId().toString();

  const payment = await Payment.create({
    bookingId,
    amount: booking.amount,
    status,
    transactionId
  });

  return payment;
};

export const handleWebhook = async (eventId, bookingId, status) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingEvent = await WebhookEvent.findOne({ eventId }).session(session);
    if (existingEvent) {
      await session.abortTransaction();
      session.endSession();
      return { message: "Event already processed" };
    }

    await WebhookEvent.create([{ eventId, processed: true }], { session });

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) throw new ApiError(404, "Booking not found");

    if (status === PAYMENT_STATUS.SUCCESS) {
      booking.status = BOOKING_STATUS.CONFIRMED;
    } else {
      booking.status = BOOKING_STATUS.FAILED;
    }
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    return { message: "Webhook processed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};