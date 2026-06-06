import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import Algorithm from './models/Algorithm.js';
import Game from './models/Game.js';
import { algorithms } from './data/algorithms.js';

dotenv.config();

async function seed() {
  await connectDb();

  for (const algorithm of algorithms) {
    await Algorithm.findOneAndUpdate({ slug: algorithm.slug }, algorithm, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  const savedAlgorithms = await Algorithm.find();
  for (const algorithm of savedAlgorithms) {
    await Game.findOneAndUpdate(
      { algorithmId: algorithm._id, type: 'quiz' },
      {
        algorithmId: algorithm._id,
        title: `${algorithm.name} Checkpoint`,
        type: 'quiz',
        prompt: `What is the typical average time complexity of ${algorithm.name}?`,
        choices: [algorithm.bigO.average, algorithm.bigO.worst, 'O(1)', 'O(n!)'],
        correctAnswer: algorithm.bigO.average,
        points: 10
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${savedAlgorithms.length} algorithms and quiz games.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
