import { Router } from 'express';
import authController from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { authLimiter, authenticatedLimiter } from '../../middlewares/rateLimit';
import {
  loginValidator,
  registerValidator,
  refreshTokenValidator,
} from '../../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validate(registerValidator),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, validate(loginValidator), authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  authLimiter,
  validate(refreshTokenValidator),
  authController.refreshToken
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticatedLimiter, authenticate, authController.getProfile);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticatedLimiter, authenticate, authController.logout);

export default router;
