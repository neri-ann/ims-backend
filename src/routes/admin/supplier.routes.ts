import { Router } from 'express';
import { supplierController } from '../../controllers/supplier.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

router.get('/', supplierController.list.bind(supplierController));
router.post('/', supplierController.create.bind(supplierController));
router.get('/:id', supplierController.getById.bind(supplierController));
router.put('/:id', supplierController.update.bind(supplierController));

export default router;
