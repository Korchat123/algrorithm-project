import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import KnnExample from './models/KnnExample.js';
import { knnExamples } from './data/knnExamples.js';

dotenv.config();

async function seedKnnExamples() {
  await connectDb();

  await KnnExample.deleteMany({});
  await KnnExample.insertMany(knnExamples);

  console.log(`Seeded ${await KnnExample.countDocuments()} KNN examples.`);
  process.exit(0);
}

seedKnnExamples().catch((error) => {
  console.error(error);
  process.exit(1);
});
