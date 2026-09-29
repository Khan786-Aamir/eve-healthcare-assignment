import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  processed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('WebhookEvent', webhookEventSchema);