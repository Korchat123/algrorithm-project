import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'implemented'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
