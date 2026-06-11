import dotenv from 'dotenv';
import app from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://algrorithm-project.vercel.app'
]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isAllowedDevOrigin(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
}))



const isAllowedDevOrigin = (origin) => {
  if (process.env.NODE_ENV === 'development') {
    const devOriginPattern = /^http:\/\/localhost:\d{4}$/
    return devOriginPattern.test(origin)
  }
  return false
} 

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
