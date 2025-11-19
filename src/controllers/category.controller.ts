import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { logger } from '../config/logger';

export class CategoryController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.list();
      res.json(result);
    } catch (error) {
      logger.error('[CategoryController] Error listing categories:', error);
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) { res.status(400).json({ error: 'Invalid id' }); return; }
      const c = await categoryService.getById(id);
      res.json({ data: c });
    } catch (error) {
      logger.error('[CategoryController] Error fetching category:', error);
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
