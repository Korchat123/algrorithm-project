import { Router } from 'express';
import Algorithm from '../models/Algorithm.js';
import KnnExample from '../models/KnnExample.js';
import { algorithms } from '../data/algorithms.js';
import { knnExamples } from '../data/knnExamples.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const saved = await Algorithm.find({ slug: { $ne: 'vector-search' } }).sort({ category: 1, name: 1 });
    res.json(saved.length ? saved : algorithms);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    if (req.params.slug === 'vector-search') {
      return res.status(404).json({ message: 'Algorithm not found' });
    }
    const saved = await Algorithm.findOne({ slug: req.params.slug });
    const fallback = algorithms.find((item) => item.slug === req.params.slug);
    const algorithm = saved || fallback;

    if (!algorithm) {
      return res.status(404).json({ message: 'Algorithm not found' });
    }

    if (req.params.slug === 'knn') {
      const trainingExamples = await KnnExample.find({}).sort({ category: 1, text: 1 }).lean();
      const payload = typeof algorithm.toObject === 'function' ? algorithm.toObject() : algorithm;
      return res.json({
        ...payload,
        demo: {
          ...(payload.demo || {}),
          input: payload.demo?.input || fallback?.demo?.input,
          target: 'bird',
          note: 'Each sample has numeric features. Bird is new data, then KNN uses the nearest feature points to classify it.'
        },
        trainingExamples: trainingExamples.length ? trainingExamples : knnExamples
      });
    }

    res.json(algorithm);
  } catch (error) {
    next(error);
  }
});

export default router;
