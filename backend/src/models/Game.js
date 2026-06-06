import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    algorithmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Algorithm',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['understand', 'quiz', 'implementation'],
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    choices: [String],
    correctAnswer: String,
    points: {
      type: Number,
      default: 10,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Game', gameSchema);
