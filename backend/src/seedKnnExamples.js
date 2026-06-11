import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import KnnExample from './models/KnnExample.js';
import { knnExamples } from './data/knnExamples.js';

dotenv.config();

async function seedKnnExamples() {
  await connectDb();

  for (const example of knnExamples) {
    await KnnExample.updateOne(
      { text: example.text },
      { $set: example },
      { upsert: true }
    );
  }

  console.log(`Seeded ${await KnnExample.countDocuments()} KNN examples.`);
  process.exit(0);
}

seedKnnExamples().catch((error) => {
  console.error(error);
  process.exit(1);
});
