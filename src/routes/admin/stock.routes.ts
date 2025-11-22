import { Router } from 'express';
import { stockController } from '../../controllers/stock.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

router.get('/', stockController.list.bind(stockController));
router.post('/', stockController.create.bind(stockController));
router.get('/:id', stockController.get.bind(stockController));
router.patch('/:id', stockController.update.bind(stockController));
router.patch('/:stockId/batch/:batchId/delete', stockController.softDeleteBatch.bind(stockController));
router.delete('/:id', stockController.delete.bind(stockController));

export default router;
