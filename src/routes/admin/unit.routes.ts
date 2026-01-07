import { Router } from 'express';
import { unitController } from '../../controllers/unit.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

router.get('/', unitController.list.bind(unitController));
router.get('/:id', unitController.getById.bind(unitController));

export default router;
