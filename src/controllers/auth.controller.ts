import { Response } from 'express';
import { AuthRequest } from '../types';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Auth Controller
 * Handles authentication HTTP requests
 */
export class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
    });

    return sendSuccess(res, SUCCESS_MESSAGES.REGISTER_SUCCESS, result, HTTP_STATUS.CREATED);
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return sendSuccess(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, result);
  });

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    return sendSuccess(res, 'Token refreshed successfully', tokens);
  });

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const user = await authService.getProfile(userId);

    return sendSuccess(res, 'Profile retrieved successfully', user);
  });

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
    // In a real application, you might want to:
    // 1. Blacklist the token
    // 2. Clear refresh token from database
    // 3. Clear any session data

    return sendSuccess(res, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  });
}

export default new AuthController();
