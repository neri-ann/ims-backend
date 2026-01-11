/**
 * Batch Service
 * Business logic for batch management with joined data
 */

import { prisma } from '../config/database';
import { logger } from '../config/logger';

// ===========================
// Types & Interfaces
// ===========================

export interface StockWithBatchTotal {
  id: number;
  item_code: string | null;
  item_name: string | null;
  unit_name: string | null;
  abbreviation: string | null;
  total_quantity: string;
}

// ===========================
// Batch Service Class
// ===========================

export class BatchService {
  /**
   * Get consumable batches (AVAILABLE or LOW_STOCK)
   * For employee requests - consumable items
   */
  async getConsumableBatches(): Promise<StockWithBatchTotal[]> {
    try {
      logger.info('Fetching consumable batches');

      // Get stocks with their batches
      const stocks = await prisma.stock.findMany({
        where: {
          is_deleted: false,
          status: {
            in: ['AVAILABLE', 'LOW_STOCK'],
          },
          item: {
            category: {
              category_name: 'Consumable',
            },
          },
        },
        select: {
          id: true,
          item_code: true,
          item: {
            select: {
              item_name: true,
              unit: {
                select: {
                  unit_name: true,
                  abbreviation: true,
                },
              },
            },
          },
          batches: {
            where: {
              is_deleted: false,
            },
            select: {
              quantity: true,
            },
          },
        },
      });

      // Transform and aggregate batch quantities
      const result: StockWithBatchTotal[] = stocks.map((stock) => {
        const totalQuantity = stock.batches.reduce(
          (sum, batch) => sum + Number(batch.quantity),
          0
        );

        return {
          id: stock.id,
          item_code: stock.item_code,
          item_name: stock.item?.item_name || null,
          unit_name: stock.item?.unit?.unit_name || null,
          abbreviation: stock.item?.unit?.abbreviation || null,
          total_quantity: totalQuantity.toString(),
        };
      });

      logger.info(`Retrieved ${result.length} consumable stocks`);
      return result;
    } catch (error) {
      logger.error('Error fetching consumable batches:', error);
      throw error;
    }
  }

  /**
   * Get non-consumable batches (AVAILABLE only)
   * For employee requests - non-consumable items (assets/equipment)
   */
  async getNonConsumableBatches(): Promise<StockWithBatchTotal[]> {
    try {
      logger.info('Fetching non-consumable batches');

      // Get stocks with their batches
      const stocks = await prisma.stock.findMany({
        where: {
          is_deleted: false,
          status: 'AVAILABLE',
          item: {
            category: {
              category_name: {
                not: 'Consumable',
              },
            },
          },
        },
        select: {
          id: true,
          item_code: true,
          item: {
            select: {
              item_name: true,
              unit: {
                select: {
                  unit_name: true,
                  abbreviation: true,
                },
              },
            },
          },
          batches: {
            where: {
              is_deleted: false,
            },
            select: {
              quantity: true,
            },
          },
        },
      });

      // Transform and aggregate batch quantities
      const result: StockWithBatchTotal[] = stocks.map((stock) => {
        const totalQuantity = stock.batches.reduce(
          (sum, batch) => sum + Number(batch.quantity),
          0
        );

        return {
          id: stock.id,
          item_code: stock.item_code,
          item_name: stock.item?.item_name || null,
          unit_name: stock.item?.unit?.unit_name || null,
          abbreviation: stock.item?.unit?.abbreviation || null,
          total_quantity: totalQuantity.toString(),
        };
      });

      logger.info(`Retrieved ${result.length} non-consumable stocks`);
      return result;
    } catch (error) {
      logger.error('Error fetching non-consumable batches:', error);
      throw error;
    }
  }

  /**
   * Deduct quantity from batches by stock_id
   * Deducts from batches with nearest expiration date first
   * Handles cases where quantity spans multiple batches
   */
  async deductBatchQuantity(stockId: number, quantityToDeduct: number, updatedBy?: string): Promise<{
    success: boolean;
    deductedBatches: Array<{ batchId: number; deductedQuantity: number; remainingQuantity: number }>;
    totalDeducted: number;
    message: string;
  }> {
    try {
      logger.info(`[BatchService] Deducting ${quantityToDeduct} from stock_id ${stockId}`);

      // Get all active batches for this stock_id, ordered by expiration date (nearest first)
      // Null expiration dates come last (non-expiring items)
      const batches = await prisma.batch.findMany({
        where: {
          stock_id: stockId,
          is_deleted: false,
          quantity: {
            gt: 0,
          },
        },
        orderBy: [
          { expiration_date: { sort: 'asc', nulls: 'last' } },
          { received_date: 'asc' }, // FIFO within same expiration
        ],
      });

      if (batches.length === 0) {
        logger.warn(`[BatchService] No available batches found for stock_id ${stockId}`);
        return {
          success: false,
          deductedBatches: [],
          totalDeducted: 0,
          message: `No available batches found for stock_id ${stockId}`,
        };
      }

      // Calculate total available quantity
      const totalAvailable = batches.reduce(
        (sum, batch) => sum + Number(batch.quantity),
        0
      );

      if (totalAvailable < quantityToDeduct) {
        logger.warn(
          `[BatchService] Insufficient stock. Available: ${totalAvailable}, Requested: ${quantityToDeduct}`
        );
        return {
          success: false,
          deductedBatches: [],
          totalDeducted: 0,
          message: `Insufficient stock. Available: ${totalAvailable}, Requested: ${quantityToDeduct}`,
        };
      }

      // Deduct quantities in a transaction
      const deductedBatches: Array<{ batchId: number; deductedQuantity: number; remainingQuantity: number }> = [];
      let remainingToDeduct = quantityToDeduct;

      await prisma.$transaction(async (tx) => {
        for (const batch of batches) {
          if (remainingToDeduct <= 0) break;

          const batchQuantity = Number(batch.quantity);
          const deductFromThisBatch = Math.min(batchQuantity, remainingToDeduct);
          const newQuantity = batchQuantity - deductFromThisBatch;

          // Update batch quantity
          await tx.batch.update({
            where: { id: batch.id },
            data: {
              quantity: newQuantity,
              updated_by: updatedBy || 'system',
              updated_at: new Date(),
            },
          });

          deductedBatches.push({
            batchId: batch.id,
            deductedQuantity: deductFromThisBatch,
            remainingQuantity: newQuantity,
          });

          remainingToDeduct -= deductFromThisBatch;

          logger.info(
            `[BatchService] Deducted ${deductFromThisBatch} from batch ${batch.id}. ` +
            `Remaining in batch: ${newQuantity}`
          );
        }

        // Update stock's current_stock after deduction
        const stock = await tx.stock.findUnique({
          where: { id: stockId },
        });

        if (stock) {
          const newCurrentStock = Number(stock.current_stock) - quantityToDeduct;
          
          // Determine new status based on stock level
          let newStatus: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'AVAILABLE';
          if (newCurrentStock <= 0) {
            newStatus = 'OUT_OF_STOCK';
          } else if (newCurrentStock <= Number(stock.reorder_level)) {
            newStatus = 'LOW_STOCK';
          }

          await tx.stock.update({
            where: { id: stockId },
            data: {
              current_stock: newCurrentStock,
              status: newStatus,
              updated_by: updatedBy || 'system',
              updated_at: new Date(),
            },
          });

          logger.info(
            `[BatchService] Updated stock ${stockId} current_stock to ${newCurrentStock}, status: ${newStatus}`
          );
        }
      });

      logger.info(
        `[BatchService] Successfully deducted ${quantityToDeduct} from stock_id ${stockId}`
      );

      return {
        success: true,
        deductedBatches,
        totalDeducted: quantityToDeduct,
        message: `Successfully deducted ${quantityToDeduct} from ${deductedBatches.length} batch(es)`,
      };
    } catch (error) {
      logger.error('[BatchService] Error deducting batch quantity:', error);
      throw error;
    }
  }
}
