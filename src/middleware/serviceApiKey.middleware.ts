import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { logger } from '../config/logger';

/**
 * Service API Key middleware for microservice-to-microservice authentication
 * Used when other services call this inventory API
 */
export const validateServiceApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    logger.warn('Service API key missing', {
      ip: req.ip,
      url: req.url,
    });
    return res.status(401).json({
      success: false,
      message: 'API key required',
    });
  }

  // Validate against known service API keys
  const validKeys = [
    config.financeApiKey,
    config.hrApiKey,
    config.auditLogsApiKey,
  ];

  if (!validKeys.includes(apiKey)) {
    logger.warn('Invalid service API key', {
      ip: req.ip,
      url: req.url,
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  logger.debug('✅ Service authenticated via API key');
  next();
};
