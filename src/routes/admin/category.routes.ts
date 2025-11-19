import { Router } from 'express';
import { categoryController } from '../../controllers/category.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

router.get('/', categoryController.list.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));

export default router;
