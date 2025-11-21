import { Request, Response, NextFunction } from 'express';
import { unitService } from '../services/unit.service';
import { logger } from '../config/logger';

export class UnitController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await unitService.list();
      res.json(result);
    } catch (error) {
      logger.error('[UnitController] Error listing units:', error);
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
      const unit = await unitService.getById(id);
      res.json({ data: unit });
    } catch (error) {
      logger.error('[UnitController] Error fetching unit:', error);
      next(error);
    }
  }
}

export const unitController = new UnitController();
