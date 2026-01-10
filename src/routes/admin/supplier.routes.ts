import { Router } from 'express';
import { supplierController } from '../../controllers/supplier.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

const authMiddleware = [authenticate, authorize('admin', 'inventory_manager')];

router.get('/', ...authMiddleware, supplierController.list.bind(supplierController));
router.post('/', ...authMiddleware, supplierController.create.bind(supplierController));
router.post('/unrecorded', supplierController.createUnrecordedSupplier.bind(supplierController));
router.get('/:id', ...authMiddleware, supplierController.getById.bind(supplierController));
router.put('/:id', ...authMiddleware, supplierController.update.bind(supplierController));

export default router;
