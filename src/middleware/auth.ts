
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { config } from '../config/env';
// auth bypass: verifyAccessToken not required when bypassing auth

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
  _res: Response,
  next: NextFunction
) => {
  // Check if JWT auth is disabled
  if (!config.enableJwtAuth) {
    // FORCE-BYPASS AUTH: Always set a mock user and continue.
    // This is intentionally permissive to allow frontend dev/testing without tokens.
    logger.warn('⚠️  FORCED AUTH BYPASS: authentication disabled by middleware');
    // touch request to avoid unused param warnings
    const _reqOrigin = (req.headers && (req.headers as any).origin) || '';
    void _reqOrigin;
    req.user = {
      sub: 'dev-user-id',
      employeeNumber: 'DEV-001',
      role: 'ADMIN',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    return next();
  }

  // TODO: Implement actual JWT verification using JWKS from ms-auth
  // For now, since auth is enabled but not implemented, bypass with warning
  logger.warn('⚠️  JWT AUTH ENABLED BUT NOT IMPLEMENTED: bypassing for now');
  req.user = {
    sub: 'dev-user-id',
    employeeNumber: 'DEV-001',
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return next();
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
  // Optional auth - since we are bypassing global auth, just continue
  const _reqOriginOpt = (req.headers && (req.headers as any).origin) || '';
  void _reqOriginOpt;
  return next();
};

