/**
 * Item Controller
 * Handles HTTP request/response for item management endpoints
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import { itemService } from '../services/item.service';
import type { ItemCreateData, ItemUpdateData, ItemListFilters } from '../services/item.service';
// Note: intentionally using runtime-mapped shapes for frontend compatibility

export class ItemController {
  /**
   * GET /api/v1/admin/items
   * List items with pagination and filtering
   */
  async listItems(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('[ItemController] List items request', {
        query: req.query,
        user: req.user,
      });

      const filters: ItemListFilters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        status: req.query.status as any,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await itemService.listItems(filters);

      // Map to frontend expected shape: { data: mapped, meta: { total, page, limit, pages } }
      const items = result.data as any[];
      const mapped = items.map((it) => ({
        ...(it as Record<string, unknown>),
  // Provide frontend-friendly id field (frontend expects item_id string like ITEM-00001)
  item_id: ((it as any).item_code),
        supplierCount: (it as any)._count ? (it as any)._count.supplier_items ?? 0 : 0,
      }));

      const meta = {
        total: result.pagination?.total ?? 0,
        page: result.pagination?.page ?? (filters.page || 1),
        limit: result.pagination?.limit ?? (filters.limit || 20),
        pages: result.pagination ? Math.ceil((result.pagination.total || 0) / (result.pagination.limit || 1)) : 1,
      };

      res.json({ data: mapped, meta });
    } catch (error) {
      logger.error('[ItemController] Error listing items:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/items/:id
   * Get a single item by ID
   */
  async getItemById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      logger.info(`[ItemController] Get item by ID: ${id}`);

      const item = await itemService.getItemById(id);
      // compute supplierCount if present in _count
      const supplierCount = (item as any)._count?.supplier_items ?? 0;
      const out = {
        ...(item as Record<string, unknown>),
  // make sure frontend receives item_id property (string code)
  item_id: ((item as any).item_code),
        supplierCount,
      };
      res.json(out);
    } catch (error) {
      logger.error(`[ItemController] Error getting item:`, error);
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/items
   * Create a new item
   */
  async createItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('[ItemController] Create item request', {
        body: req.body,
        user: req.user,
      });

      const userId = req.user?.sub || 'system';
      const data: ItemCreateData = req.body;
      
      const item = await itemService.createItem(data, userId);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      logger.error('[ItemController] Error creating item:', error);
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/items/:id
   * Update an existing item
   */
  async updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      logger.info(`[ItemController] Update item: ${id}`, {
        body: req.body,
        user: req.user,
      });

      const userId = req.user?.sub || 'system';
      const data: ItemUpdateData = req.body;
      
      const item = await itemService.updateItem(id, data, userId);

      res.json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      logger.error('[ItemController] Error updating item:', error);
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/items/:id
   * Delete an item (soft delete)
   */
  async deleteItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      logger.info(`[ItemController] Delete item: ${id}`, { user: req.user });

      const userId = req.user?.sub || 'system';
      const result = await itemService.deleteItem(id, userId);

      res.json(result);
    } catch (error) {
      logger.error('[ItemController] Error deleting item:', error);
      next(error);
    }
  }
}

export const itemController = new ItemController();
