/**
 * Batch Routes (Admin)
 * RESTful API endpoints for batch management
 * Requires authentication
 */

import { Router } from 'express';
import { batchController } from '../../controllers/batch.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

// All routes require authentication
const authMiddleware = [authenticate, authorize('admin', 'inventory_manager', 'employee')];

/**
 * @route   GET /api/v1/admin/batches/consumable
 * @desc    Get consumable batches (AVAILABLE or LOW_STOCK)
 * @access  Admin, Inventory Manager, Employee
 */
router.get('/consumable', ...authMiddleware, batchController.getConsumableBatches.bind(batchController));

/**
 * @route   GET /api/v1/admin/batches/non-consumable
 * @desc    Get non-consumable batches (AVAILABLE only)
 * @access  Admin, Inventory Manager, Employee
 */
router.get('/non-consumable', ...authMiddleware, batchController.getNonConsumableBatches.bind(batchController));

/**
 * @route   PATCH /api/v1/admin/batches/deduct
 * @desc    Deduct quantity from batches by stock_id (nearest expiration first)
 * @body    { stockId: number, quantity: number }
 * @access  Admin, Inventory Manager, Employee
 */
router.patch('/deduct', ...authMiddleware, batchController.deductBatchQuantity.bind(batchController));

export default router;
