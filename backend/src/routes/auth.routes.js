import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { signToken } from '../utils/token.js';
import { sendPasswordChangedEmail, sendVerificationEmail } from '../utils/email.js';

const router = Router();

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email, and 6+ character password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

    const user = await User.createWithPassword({ 
      name, 
      email, 
      password,
      verificationToken,
      verificationTokenExpires
    });

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      user: publicUser(user) 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/verify/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.', token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const { name, currentPassword, password } = req.body;
    const user = await User.findById(req.user._id);
    let passwordChanged = false;

    if (name) user.name = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be 6+ characters' });
      }
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      user.passwordHash = await bcrypt.hash(password, 12);
      passwordChanged = true;
    }

    await user.save();
    if (passwordChanged) {
      try {
        await sendPasswordChangedEmail(user.email, user.name);
      } catch (emailError) {
        console.warn('Password change email failed:', emailError.message);
      }
    }

    res.json({
      user: publicUser(user),
      message: passwordChanged
        ? 'Profile updated. A password change confirmation was sent to your email.'
        : 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;
