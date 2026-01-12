
import { Router } from 'express';
import { listBusDisposals, listStockDisposals, getDisposalById } from '../../controllers/disposal.controller';

const router = Router();

// GET /api/v1/admin/disposals/bus
router.get('/bus', listBusDisposals);

// GET /api/v1/admin/disposals/stock
router.get('/stock', listStockDisposals);

// GET /api/v1/admin/disposals/:id
router.get('/:id', getDisposalById);

export default router;
