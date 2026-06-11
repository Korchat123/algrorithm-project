import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import Algorithm from './models/Algorithm.js';
import Game from './models/Game.js';
import KnnExample from './models/KnnExample.js';
import { algorithms } from './data/algorithms.js';
import { gamesData } from './data/games.js';
import { knnExamples } from './data/knnExamples.js';

dotenv.config();

async function seed() {
  await connectDb();

  console.log('Clearing existing data...');
  await Algorithm.deleteMany({});
  await Game.deleteMany({});
  await KnnExample.deleteMany({});

  console.log('Seeding algorithms...');
  const savedAlgorithms = [];
  for (const algoData of algorithms) {
    const algo = await Algorithm.create(algoData);
    savedAlgorithms.push(algo);
  }

  console.log('Seeding KNN training examples...');
  await KnnExample.insertMany(knnExamples);

  console.log('Seeding games and levels...');
  for (const gData of gamesData) {
    // Find associated algorithm by slug if possible
    const algorithm = savedAlgorithms.find(a => a.slug === gData.slug) || savedAlgorithms[0];
    
    for (const levelData of gData.levels) {
      // Standard Mode
      await Game.create({
        algorithmId: algorithm._id,
        title: gData.title,
        type: gData.type,
        level: levelData.level,
        mode: 'standard',
        prompt: gData.prompt,
        difficultyParams: levelData.params,
        points: levelData.points
      });

      // Time Attack Mode
      await Game.create({
        algorithmId: algorithm._id,
        title: `${gData.title} (Time Attack)`,
        type: gData.type,
        level: levelData.level,
        mode: 'time-attack',
        prompt: `${gData.prompt} (Time Attack)`,
        difficultyParams: { ...levelData.params, timeLimit: 60 - (levelData.level * 5) },
        points: levelData.points * 2
      });
    }
  }

  // Seed Quizzes for each algorithm
  for (const algorithm of savedAlgorithms) {
    await Game.create({
      algorithmId: algorithm._id,
      title: `${algorithm.name} Checkpoint`,
      type: 'quiz',
      prompt: `What is the typical average time complexity of ${algorithm.name}?`,
      choices: [algorithm.bigO.average, algorithm.bigO.worst, 'O(1)', 'O(n!)'],
      correctAnswer: algorithm.bigO.average,
      points: 10
    });
  }

  console.log(`Seeded ${savedAlgorithms.length} algorithms, ${await KnnExample.countDocuments()} KNN examples, and ${await Game.countDocuments()} games/levels.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
