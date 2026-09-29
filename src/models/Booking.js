import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../constants/index.js';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
  appointmentDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);