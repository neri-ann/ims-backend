import jwt from 'jsonwebtoken';
import config from '../config';
import { JwtPayload, TokenResponse } from '../types';
import { TokenType } from '../constants';

/**
 * Generate JWT token
 */
export const generateToken = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  type: TokenType = TokenType.ACCESS
): string => {
  const secret = type === TokenType.ACCESS ? config.jwt.secret : config.jwt.refreshSecret;
  const expiresIn = type === TokenType.ACCESS ? config.jwt.expiresIn : config.jwt.refreshExpiresIn;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload as any, secret, { expiresIn: expiresIn as any });
};

/**
 * Generate access and refresh tokens
 */
export const generateTokens = (payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenResponse => {
  const accessToken = generateToken(payload, TokenType.ACCESS);
  const refreshToken = generateToken(payload, TokenType.REFRESH);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (
  token: string,
  type: TokenType = TokenType.ACCESS
): JwtPayload | null => {
  try {
    const secret = type === TokenType.ACCESS ? config.jwt.secret : config.jwt.refreshSecret;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Decode JWT token without verification (for debugging)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
