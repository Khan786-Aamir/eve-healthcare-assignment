import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constants/index.js';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(PAYMENT_STATUS), required: true },
  transactionId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);