// src/routes/admin/bus-operation.routes.ts
import { Router } from 'express';
import { getActiveBusesForOperation } from '../../controllers/busOperation.controller';

const router = Router();

router.get('/', getActiveBusesForOperation);

export default router;
