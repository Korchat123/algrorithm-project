import { Router } from 'express';
import Algorithm from '../models/Algorithm.js';
import { algorithms } from '../data/algorithms.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const saved = await Algorithm.find().sort({ category: 1, name: 1 });
    res.json(saved.length ? saved : algorithms);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const saved = await Algorithm.findOne({ slug: req.params.slug });
    const fallback = algorithms.find((item) => item.slug === req.params.slug);
    const algorithm = saved || fallback;

    if (!algorithm) {
      return res.status(404).json({ message: 'Algorithm not found' });
    }

    res.json(algorithm);
  } catch (error) {
    next(error);
  }
});

export default router;
