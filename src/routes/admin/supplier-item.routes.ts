import { Router } from 'express';
import { supplierItemController } from '../../controllers/supplierItem.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

const authMiddleware = [authenticate, authorize('admin', 'inventory_manager')];

router.get('/', ...authMiddleware, supplierItemController.list.bind(supplierItemController));
router.get('/:supplierCode/:itemCode', supplierItemController.getBySupplierAndItemCodes.bind(supplierItemController));
router.post('/', ...authMiddleware, supplierItemController.create.bind(supplierItemController));
router.post('/relation', supplierItemController.createRelation.bind(supplierItemController));
router.patch('/', ...authMiddleware, supplierItemController.patch.bind(supplierItemController));
router.delete('/', ...authMiddleware, supplierItemController.delete.bind(supplierItemController));

export default router;
