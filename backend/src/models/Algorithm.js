import mongoose from 'mongoose';

const codeExampleSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ['C', 'C++', 'JavaScript', 'Java', 'Python', 'Go', 'Rust'],
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const algorithmSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['search', 'sort', 'graph', 'machine-learning'],
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    bigO: {
      best: String,
      average: String,
      worst: String,
      space: String
    },
    codeExamples: [codeExampleSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Algorithm', algorithmSchema);
