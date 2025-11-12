import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { HTTP_STATUS, ERROR_MESSAGES, HEADERS } from '../constants';
import { UserRole, TokenType } from '../constants';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers[HEADERS.AUTHORIZATION.toLowerCase()];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decoded = verifyToken(token, TokenType.ACCESS);

    if (!decoded) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware factory
 * Checks if user has required role(s)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication middleware
 * Does not throw error if token is missing
 */
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers[HEADERS.AUTHORIZATION.toLowerCase()];

    if (authHeader && typeof authHeader === 'string') {
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken(token, TokenType.ACCESS);

      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
