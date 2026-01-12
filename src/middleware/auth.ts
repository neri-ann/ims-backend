
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { verifyAccessToken } from '../lib/jwks-verifier';

/**
 * JWT Payload interface matching ms-auth token structure
 */
export interface JWTPayload {
  sub: string;              // User ID
  employeeNumber?: string;  // Employee number
  employeeId?: string;      // Employee ID
  role?: string;            // User role (singular string, e.g., 'USER', 'ADMIN')
  departmentIds?: string[]; // Department IDs
  departmentName?: string[];  // Department names (array)
  positionName?: string[];    // Position names (array)
  jti?: string;             // JWT ID
  iat?: number;             // Issued at
  exp?: number;             // Expires at
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
 * Authentication middleware - validates JWT token using JWKS
 * 
 * IMPORTANT: Inventory service does NOT handle passwords or user login.
 * The ms-auth microservice handles all authentication and issues tokens.
 * This middleware verifies tokens using the public key from ms-auth JWKS endpoint.
 * 
 * Can be disabled via ENABLE_JWT_AUTH=false in .env (for development only)
 */
export const authenticate = async (
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
      employeeNumber: 'DEV-001',
      role: 'ADMIN',
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

    // Verify token using JWKS (RS256)
    const decoded = await verifyAccessToken(token);

    // Attach user to request
    req.user = {
      sub: decoded.sub,
      employeeNumber: decoded.employeeNumber,
      employeeId: decoded.employeeId,
      role: decoded.role,
      departmentIds: decoded.departmentIds,
      departmentName: decoded.departmentName,
      positionName: decoded.positionName,
      jti: decoded.jti,
      iat: decoded.iat as number,
      exp: decoded.exp as number,
    };

    logger.debug(`✅ User authenticated: ${decoded.employeeNumber || decoded.sub} (role: ${decoded.role || 'none'})`);
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    if (errorMessage.includes('Invalid') || errorMessage.includes('invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication - validates token if present but doesn't require it
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuth = async (
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
    const decoded = await verifyAccessToken(token);
    req.user = {
      sub: decoded.sub,
      employeeNumber: decoded.employeeNumber,
      employeeId: decoded.employeeId,
      role: decoded.role,
      departmentIds: decoded.departmentIds,
      departmentName: decoded.departmentName,
      positionName: decoded.positionName,
      jti: decoded.jti,
      iat: decoded.iat as number,
      exp: decoded.exp as number,
    };
    next();
  } catch (error) {
    // Invalid token, but that's okay for optional auth
    next();
  }
};

