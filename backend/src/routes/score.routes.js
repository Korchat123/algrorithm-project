import { Router } from 'express';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .populate('gameId', 'title type level mode')
      .populate('algorithmId', 'name slug category')
      .sort({ completedAt: -1 });
    res.json(scores);
  } catch (error) {
    next(error);
  }
});

router.get('/me/stats', requireAuth, async (req, res, next) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .populate('gameId', 'title type level mode')
      .sort({ completedAt: -1 });

    const stats = new Map();

    scores.forEach((score) => {
      if (!score.gameId || score.gameId.type !== 'game') return;

      const title = score.gameId.title.replace(/\s+\(Time Attack\)$/i, '');
      const current = stats.get(title) || {
        title,
        bestScore: 0,
        maxScore: 0,
        bestTimeSeconds: null,
        gamesPlayed: 0,
        bestLevel: 1,
        modes: new Set()
      };

      current.bestScore = Math.max(current.bestScore, score.score);
      current.maxScore = Math.max(current.maxScore, score.maxScore);
      current.bestLevel = Math.max(current.bestLevel, score.level || score.gameId.level || 1);
      current.gamesPlayed += 1;
      current.modes.add(score.mode || score.gameId.mode || 'standard');

      if (typeof score.timeSeconds === 'number') {
        current.bestTimeSeconds = current.bestTimeSeconds === null
          ? score.timeSeconds
          : Math.min(current.bestTimeSeconds, score.timeSeconds);
      }

      stats.set(title, current);
    });

    res.json(Array.from(stats.values()).map((stat) => ({
      ...stat,
      modes: Array.from(stat.modes).sort()
    })).sort((a, b) => b.bestScore - a.bestScore || a.title.localeCompare(b.title)));
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $count: {} }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          totalScore: 1,
          gamesPlayed: 1
        }
      }
    ]);
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { gameId, answer, score: customScore, level, mode, timeSeconds } = req.body;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isCorrect = game.type === 'quiz' 
      ? String(answer).trim().toLowerCase() === String(game.correctAnswer).trim().toLowerCase()
      : true; // For game modes, score is sent directly

    const payload = {
      userId: req.user._id,
      gameId: game._id,
      algorithmId: game.algorithmId,
      score: game.type === 'quiz' ? (isCorrect ? game.points : 0) : customScore,
      maxScore: game.points,
      level: level || game.level,
      mode: mode || game.mode,
      timeSeconds: typeof timeSeconds === 'number' ? timeSeconds : undefined,
      answer: String(answer)
    };

    const query = {
      userId: req.user._id,
      gameId: game._id,
      level: payload.level,
      mode: payload.mode
    };

    const existing = await Score.findOne(query);
    let score;

    if (existing) {
      existing.score = Math.max(existing.score, payload.score);
      existing.maxScore = Math.max(existing.maxScore, payload.maxScore);
      existing.answer = payload.answer;
      existing.completedAt = new Date();

      if (typeof payload.timeSeconds === 'number') {
        existing.timeSeconds = typeof existing.timeSeconds === 'number'
          ? Math.min(existing.timeSeconds, payload.timeSeconds)
          : payload.timeSeconds;
      }

      score = await existing.save();
    } else {
      score = await Score.create(payload);
    }

    res.status(201).json({ score, isCorrect });
  } catch (error) {
    next(error);
  }
});

export default router;
