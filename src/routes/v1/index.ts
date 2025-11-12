import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

/**
 * API v1 Routes
 */
router.use('/auth', authRoutes);

// Add more route modules here as needed
// Example:
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

export default router;
