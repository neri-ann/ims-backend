import { Router } from 'express';
import { supplierItemController } from '../../controllers/supplierItem.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

router.get('/', supplierItemController.list.bind(supplierItemController));
router.post('/', supplierItemController.create.bind(supplierItemController));
router.patch('/', supplierItemController.patch.bind(supplierItemController));
router.delete('/', supplierItemController.delete.bind(supplierItemController));

export default router;
