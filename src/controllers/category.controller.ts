import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import type { CategoryCreateData, CategoryUpdateData } from '../services/category.service';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';

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
      if (Number.isNaN(id)) { 
        res.status(400).json({ error: 'Invalid id' }); 
        return; 
      }
      const c = await categoryService.getById(id);
      res.json({ data: c });
    } catch (error) {
      logger.error('[CategoryController] Error fetching category:', error);
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: CategoryCreateData = {
        category_name: req.body.categoryName || req.body.category_name,
        description: req.body.categoryDescription || req.body.description,
      };

      const userId = req.user?.sub || 'system';
      const category = await categoryService.create(data, userId);

      // Map to frontend expected format
      const response = {
        id: category.id,
        categoryCode: category.category_code,
        categoryName: category.category_name,
        categoryDescription: category.description || '',
        date_created: category.created_at,
        date_updated: category.updated_at,
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('[CategoryController] Error creating category:', error);
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
      }

      const data: CategoryUpdateData = {
        category_name: req.body.categoryName || req.body.category_name,
        description: req.body.categoryDescription || req.body.description,
      };

      const userId = req.user?.sub || 'system';
      const category = await categoryService.update(id, data, userId);

      // Map to frontend expected format
      const response = {
        success: true,
        data: {
          id: category.id,
          categoryCode: category.category_code,
          categoryName: category.category_name,
          categoryDescription: category.description || '',
          date_created: category.created_at,
          date_updated: category.updated_at,
        },
      };

      res.json(response);
    } catch (error) {
      logger.error('[CategoryController] Error updating category:', error);
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
      }

      const userId = req.user?.sub || 'system';
      const result = await categoryService.delete(id, userId);

      res.json(result);
    } catch (error) {
      logger.error('[CategoryController] Error deleting category:', error);
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
