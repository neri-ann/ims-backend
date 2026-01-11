/**
 * Batch Service
 * Business logic for batch management with joined data
 */

import { prisma } from '../config/database';
import { logger } from '../config/logger';

// ===========================
// Types & Interfaces
// ===========================

export interface BatchWithDetails {
  batch_number: string | null;
  quantity: string;
  stock_id: number;
  stock: {
    id: number;
    item_code: string | null;
    item_name: string | null;
    unit_name: string | null;
    abbreviation: string | null;
  };
}

// ===========================
// Batch Service Class
// ===========================

export class BatchService {
  /**
   * Get consumable batches (AVAILABLE or LOW_STOCK)
   * For employee requests - consumable items
   */
  async getConsumableBatches(): Promise<BatchWithDetails[]> {
    try {
      logger.info('Fetching consumable batches');

      const batches = await prisma.batch.findMany({
        where: {
          is_deleted: false,
          stock: {
            status: {
              in: ['AVAILABLE', 'LOW_STOCK'],
            },
            item: {
              category: {
                category_name: 'Consumable',
              },
            },
          },
        },
        select: {
          batch_number: true,
          quantity: true,
          stock_id: true,
          stock: {
            select: {
              id: true,
              item: {
                select: {
                  item_code: true,
                  item_name: true,
                  unit: {
                    select: {
                      unit_name: true,
                      abbreviation: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          batch_number: 'asc',
        },
      });

      // Transform the data to match the desired structure
      const transformedBatches: BatchWithDetails[] = batches.map((batch) => ({
        batch_number: batch.batch_number,
        quantity: batch.quantity.toString(),
        stock_id: batch.stock_id,
        stock: {
          id: batch.stock.id,
          item_code: batch.stock.item.item_code,
          item_name: batch.stock.item.item_name,
          unit_name: batch.stock.item.unit?.unit_name || null,
          abbreviation: batch.stock.item.unit?.abbreviation || null,
        },
      }));

      logger.info(`Retrieved ${transformedBatches.length} consumable batches`);
      return transformedBatches;
    } catch (error) {
      logger.error('Error fetching consumable batches:', error);
      throw error;
    }
  }

  /**
   * Get non-consumable batches (AVAILABLE only)
   * For employee requests - non-consumable items (assets/equipment)
   */
  async getNonConsumableBatches(): Promise<BatchWithDetails[]> {
    try {
      logger.info('Fetching non-consumable batches');

      const batches = await prisma.batch.findMany({
        where: {
          is_deleted: false,
          stock: {
            status: 'AVAILABLE',
            item: {
              category: {
                category_name: {
                  not: 'Consumable',
                },
              },
            },
          },
        },
        select: {
          batch_number: true,
          quantity: true,
          stock_id: true,
          stock: {
            select: {
              id: true,
              item: {
                select: {
                  item_code: true,
                  item_name: true,
                  unit: {
                    select: {
                      unit_name: true,
                      abbreviation: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          batch_number: 'asc',
        },
      });

      // Transform the data to match the desired structure
      const transformedBatches: BatchWithDetails[] = batches.map((batch) => ({
        batch_number: batch.batch_number,
        quantity: batch.quantity.toString(),
        stock_id: batch.stock_id,
        stock: {
          id: batch.stock.id,
          item_code: batch.stock.item.item_code,
          item_name: batch.stock.item.item_name,
          unit_name: batch.stock.item.unit?.unit_name || null,
          abbreviation: batch.stock.item.unit?.abbreviation || null,
        },
      }));

      logger.info(`Retrieved ${transformedBatches.length} non-consumable batches`);
      return transformedBatches;
    } catch (error) {
      logger.error('Error fetching non-consumable batches:', error);
      throw error;
    }
  }
}
