import { Router } from 'express';
import User from '../models/User.js';
import Score from '../models/Score.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all users (Admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Delete user (Admin only)
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// Get all scores (Admin only)
router.get('/scores', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'name email')
      .populate('gameId', 'title level mode')
      .sort('-completedAt');
    res.json(scores);
  } catch (error) {
    next(error);
  }
});

export default router;
