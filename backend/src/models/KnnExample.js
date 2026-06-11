import mongoose from 'mongoose';

const knnExampleSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

knnExampleSchema.index({ text: 1 }, { unique: true });
knnExampleSchema.index({ category: 1 });

export default mongoose.model('KnnExample', knnExampleSchema);
