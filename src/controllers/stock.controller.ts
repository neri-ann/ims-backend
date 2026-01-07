import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import { stockService, StockListFilters } from '../services/stock.service';

export class StockController {
  async list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: StockListFilters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        search: req.query.search as string,
        status: req.query.status as string,
        category: req.query.category as string,
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        order: req.query.order as any,
      };

      const result = await stockService.listStocks(filters);
      const meta = result.pagination || {};
      res.json({ data: result.data, meta });
      return;
    } catch (error) {
      logger.error('[StockController] list error', error);
      next(error);
    }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ error: 'Invalid stock ID' }); return; }
      const result = await stockService.getStockById(id);
      res.json(result);
    } catch (error) {
      logger.error('[StockController] get error', error);
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.sub || 'system';
      const payload = {
        itemId: req.body.itemId || req.body.item_id,
        reorderLevel: req.body.reorderLevel ?? req.body.reorder_level,
        currentStock: req.body.currentStock ?? req.body.current_stock,
        batches: req.body.batches,
      };
      const created = await stockService.createStock(payload, userId);
      res.status(201).json(created);
    } catch (error) {
      logger.error('[StockController] create error', error);
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ error: 'Invalid stock ID' }); return; }
      const userId = req.user?.sub || 'system';
      const payload = {
        reorderLevel: req.body.reorderLevel ?? req.body.reorder_level,
        status: req.body.status,
        batches: req.body.batches,
      };
      const updated = await stockService.updateStock(id, payload, userId);
      res.json(updated);
    } catch (error) {
      logger.error('[StockController] update error', error);
      next(error);
    }
  }

  async softDeleteBatch(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stockId = parseInt(req.params.stockId, 10);
      const batchId = parseInt(req.params.batchId, 10);
      if (isNaN(stockId) || isNaN(batchId)) { res.status(400).json({ error: 'Invalid id' }); return; }
      const userId = req.user?.sub || 'system';
      const result = await stockService.softDeleteBatch(stockId, batchId, userId);
      res.json(result);
    } catch (error) {
      logger.error('[StockController] softDeleteBatch error', error);
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ error: 'Invalid stock ID' }); return; }
      const userId = req.user?.sub || 'system';
      const result = await stockService.deleteStock(id, userId);
      res.json(result);
    } catch (error) {
      logger.error('[StockController] delete error', error);
      next(error);
    }
  }
}

export const stockController = new StockController();
