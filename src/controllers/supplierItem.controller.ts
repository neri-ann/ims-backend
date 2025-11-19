import { Request, Response, NextFunction } from 'express';
import { supplierItemService } from '../services/supplierItem.service';
import { logger } from '../config/logger';

export class SupplierItemController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const item_id = req.query.item_id as string | undefined;
      const supplier_id = req.query.supplier_id ? Number(req.query.supplier_id) : undefined;
      const result = await supplierItemService.list({ item_id, supplier_id });
      // Return shape expected by frontend: { data: [...] }
      res.json(result);
    } catch (error) {
      logger.error('[SupplierItemController] Error listing:', error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const created = await supplierItemService.create(body);
      // service already returns the 'out' shape expected by frontend
      res.status(201).json(created);
    } catch (error) {
      logger.error('[SupplierItemController] Error creating supplier-item:', error);
      next(error);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const supplierId = Number(req.body.supplier_id ?? req.body.supplierId ?? req.body.id);
      const itemId = Number(req.body.item_id ?? req.body.itemId);
      if (Number.isNaN(supplierId) || Number.isNaN(itemId)) {
        res.status(400).json({ error: 'Invalid ids' });
        return;
      }

      const updated = await supplierItemService.patch(supplierId, itemId, req.body);
      // Return shape matching frontend: { data: updated, date_updated, updated_at }
      res.json(updated);
      return;
    } catch (error) {
      logger.error('[SupplierItemController] Error patching supplier-item:', error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const supplierId = Number(req.body.supplier_id ?? req.body.supplierId ?? req.body.id);
      const itemId = Number(req.body.item_id ?? req.body.itemId);
      if (Number.isNaN(supplierId) || Number.isNaN(itemId)) {
        res.status(400).json({ error: 'Invalid ids' });
        return;
      }
      const result = await supplierItemService.remove(supplierId, itemId);
      res.json(result);
      return;
    } catch (error) {
      logger.error('[SupplierItemController] Error deleting supplier-item:', error);
      next(error);
    }
  }
}

export const supplierItemController = new SupplierItemController();
