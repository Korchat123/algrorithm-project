import { Router } from 'express';
import Algorithm from '../models/Algorithm.js';
import Game from '../models/Game.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.algorithmId ? { algorithmId: req.query.algorithmId } : {};
    const games = await Game.find(query).populate('algorithmId', 'name slug category');
    res.json(games);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const algorithm = await Algorithm.findById(req.body.algorithmId);
    if (!algorithm) {
      return res.status(400).json({ message: 'Valid algorithmId is required' });
    }

    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
});

export default router;
