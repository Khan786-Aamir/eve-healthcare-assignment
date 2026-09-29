import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }
}, { timestamps: true });

export default mongoose.model('Test', testSchema);