import { prisma } from '../database';
import { LoginCredentials, RegisterData, TokenResponse } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import { HTTP_STATUS, ERROR_MESSAGES, TokenType, UserRole } from '../constants';
import { exclude } from '../utils';

/**
 * Auth Service
 * Handles authentication business logic
 */
export class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ user: any; tokens: TokenResponse }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.USER,
        isActive: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Exclude password from response
    const userWithoutPassword = exclude(user, ['password']);

    return { user: userWithoutPassword, tokens };
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<{ user: any; tokens: TokenResponse }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, 'Account is inactive');
    }

    // Verify password
    const isPasswordValid = await comparePassword(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Exclude password from response
    const userWithoutPassword = exclude(user, ['password']);

    return { user: userWithoutPassword, tokens };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    // Verify refresh token
    const decoded = verifyToken(refreshToken, TokenType.REFRESH);

    if (!decoded) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    return tokens;
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Exclude password from response
    return exclude(user, ['password']);
  }
}

export default new AuthService();
