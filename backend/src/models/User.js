import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createWithPassword = async function createWithPassword(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  return this.create({
    name: data.name,
    email: data.email,
    passwordHash,
    verificationToken: data.verificationToken,
    verificationTokenExpires: data.verificationTokenExpires
  });
};

export default mongoose.model('User', userSchema);
