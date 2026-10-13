import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (env.FRONTEND_URLS.includes(origin) || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic request logger in development
  if (env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      next();
    });
  }

  // Serve uploaded files statically
  const uploadsDir = path.resolve(import.meta.dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Mount API routes
  app.use('/api', apiRouter);

  // Root health endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Abel Gemstone Luxury Wholesale API',
      status: 'active',
      docs: '/api/health',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
