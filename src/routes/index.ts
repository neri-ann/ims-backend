import { Router, Request, Response } from 'express';
import v1Routes from './v1';
import config from '../config';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, 'Server is healthy', {
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

/**
 * API version routes
 */
router.use(`/${config.apiVersion}`, v1Routes);

// Add more API versions here as needed
// Example:
// router.use('/v2', v2Routes);

export default router;
