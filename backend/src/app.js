import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import algorithmRoutes from './routes/algorithm.routes.js';
import gameRoutes from './routes/game.routes.js';
import scoreRoutes from './routes/score.routes.js';
import adminRoutes from './routes/admin.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
});

export default app;
