// src/routes/admin/bus.routes.ts
import { Router } from 'express';
import { getAllBuses, getBusById } from '../../controllers/bus.controller';

const router = Router();

router.get('/', getAllBuses);
router.get('/:id', getBusById);

export default router;
