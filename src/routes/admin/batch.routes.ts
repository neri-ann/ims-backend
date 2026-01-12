/**
 * Batch Routes (Admin)
 * RESTful API endpoints for batch management
 * Public endpoints for stock-out integration
 */

import { Router } from 'express';
import { batchController } from '../../controllers/batch.controller';

const router = Router();

// Note: These endpoints are public for cross-service integration
// The purchase-request frontend needs to access batches without auth

/**
 * @route   GET /api/v1/admin/batches/consumable
 * @desc    Get consumable batches (AVAILABLE or LOW_STOCK)
 * @access  Public (for cross-service integration)
 */
router.get('/consumable', batchController.getConsumableBatches.bind(batchController));

/**
 * @route   GET /api/v1/admin/batches/non-consumable
 * @desc    Get non-consumable batches (AVAILABLE only)
 * @access  Public (for cross-service integration)
 */
router.get('/non-consumable', batchController.getNonConsumableBatches.bind(batchController));

/**
 * @route   PATCH /api/v1/admin/batches/deduct
 * @desc    Deduct quantity from batches by stock_id (nearest expiration first)
 * @body    { stockId: number, quantity: number }
 * @access  Public (for cross-service integration)
 */
router.patch('/deduct', batchController.deductBatchQuantity.bind(batchController));

export default router;
