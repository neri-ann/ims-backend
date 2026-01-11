/**
 * Batch Controller
 * Handles HTTP request/response for batch management endpoints
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import { BatchService } from '../services/batch.service';

const batchService = new BatchService();

export class BatchController {
  /**
   * GET /api/v1/admin/batches/consumable
   * Get consumable batches (AVAILABLE or LOW_STOCK)
   */
  async getConsumableBatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('[BatchController] Get consumable batches request', {
        user: req.user,
      });

      const batches = await batchService.getConsumableBatches();

      res.status(200).json({
        success: true,
        message: 'Consumable batches retrieved successfully',
        data: batches,
        meta: {
          total: batches.length,
        },
      });
    } catch (error) {
      logger.error('[BatchController] Error getting consumable batches:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/batches/non-consumable
   * Get non-consumable batches (AVAILABLE only)
   */
  async getNonConsumableBatches(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('[BatchController] Get non-consumable batches request', {
        user: req.user,
      });

      const batches = await batchService.getNonConsumableBatches();

      res.status(200).json({
        success: true,
        message: 'Non-consumable batches retrieved successfully',
        data: batches,
        meta: {
          total: batches.length,
        },
      });
    } catch (error) {
      logger.error('[BatchController] Error getting non-consumable batches:', error);
      next(error);
    }
  }
}

export const batchController = new BatchController();
