import { Router } from 'express';
import Feedback from '../models/Feedback.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { content, email } = req.body;
    const feedback = await Feedback.create({
      userId: req.user?._id,
      email: email || req.user?.email,
      content
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const feedbacks = await Feedback.find().populate('userId', 'name email').sort('-createdAt');
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
});

export default router;
