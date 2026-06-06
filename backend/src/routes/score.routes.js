import { Router } from 'express';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .populate('gameId', 'title type')
      .populate('algorithmId', 'name slug category')
      .sort({ completedAt: -1 });
    res.json(scores);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { gameId, answer } = req.body;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isCorrect = String(answer).trim().toLowerCase() === String(game.correctAnswer).trim().toLowerCase();
    const payload = {
      userId: req.user._id,
      gameId: game._id,
      algorithmId: game.algorithmId,
      score: isCorrect ? game.points : 0,
      maxScore: game.points,
      answer
    };

    const score = await Score.findOneAndUpdate(
      { userId: req.user._id, gameId: game._id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ score, isCorrect });
  } catch (error) {
    next(error);
  }
});

export default router;
