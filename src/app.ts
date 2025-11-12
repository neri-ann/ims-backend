import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimit';
import logger from './logger';

/**
 * Create Express application
 */
const createApp = (): Application => {
  const app: Application = express();

  /**
   * Security Middleware
   */
  app.use(helmet());

  /**
   * CORS Configuration
   */
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  /**
   * Body Parser Middleware
   */
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  /**
   * Request Logging
   */
  app.use((req, _res, next) => {
    logger.info(`[${req.method}] ${req.path}`);
    next();
  });

  /**
   * Rate Limiting
   */
  app.use('/api', apiLimiter);

  /**
   * API Routes
   */
  app.use('/api', routes);

  /**
   * Welcome Route
   */
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to IMS Backend API',
      version: config.apiVersion,
      documentation: '/api/health',
    });
  });

  /**
   * Error Handling
   */
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
