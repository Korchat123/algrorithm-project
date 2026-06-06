import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },
    algorithmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Algorithm',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0
    },
    answer: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

scoreSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export default mongoose.model('Score', scoreSchema);
