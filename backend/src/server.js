import dotenv from 'dotenv';
import app from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

function startServer() {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

connectDb()
  .then(startServer)
  .catch((error) => {
    console.warn('Database connection unavailable:', error.message);
    console.warn('API started without MongoDB. Configure MONGODB_URI to enable auth, scores, and saved games.');
    startServer();
  });
