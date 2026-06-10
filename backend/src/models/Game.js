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
      enum: ['understand', 'quiz', 'implementation', 'game'],
      required: true
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    mode: {
      type: String,
      enum: ['standard', 'time-attack'],
      default: 'standard'
    },
    prompt: {
      type: String,
      required: true
    },
    difficultyParams: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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
