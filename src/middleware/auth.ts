
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../config/logger';

export interface JWTPayload {
  sub: string;        // User ID (matches userId field)
  username: string;   // Username
  role: string;       // User role (admin, staff, inventory_manager, etc.)
  iat: number;        // Issued at
  exp: number;        // Expires at
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Authentication middleware - validates JWT token
 * 
 * IMPORTANT: Inventory service does NOT handle passwords or user login.
 * The HR Auth Microservice handles all authentication.
 * This middleware ONLY validates JWT tokens.
 * 
 * Can be disabled via ENABLE_JWT_AUTH=false in .env (for development only)
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // If JWT is disabled, skip authentication (development mode only)
  if (!config.enableJwtAuth) {
    logger.warn('⚠️  JWT Authentication bypassed (ENABLE_JWT_AUTH=false)');
    // Create a mock user for development
    req.user = {
      sub: 'dev-user-id',
      username: 'dev-user',
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 3600000,
    };
    return next();
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify token with shared JWT secret
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    // Attach user to request
    req.user = decoded;

    logger.debug(`✅ User authenticated: ${decoded.username} (${decoded.role})`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication - validates token if present but doesn't require it
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!config.enableJwtAuth) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token, continue without user
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Invalid token, but that's okay for optional auth
    next();
  }
};
