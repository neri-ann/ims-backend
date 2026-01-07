import { Router } from 'express';
import { categoryController } from '../../controllers/category.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

/**
 * @route   GET /api/v1/admin/categories
 * @desc    List all categories
 * @access  Admin, Inventory Manager
 */
router.get('/', categoryController.list.bind(categoryController));

/**
 * @route   POST /api/v1/admin/categories
 * @desc    Create a new category
 * @access  Admin, Inventory Manager
 */
router.post('/', categoryController.create.bind(categoryController));

/**
 * @route   GET /api/v1/admin/categories/:id
 * @desc    Get a category by ID
 * @access  Admin, Inventory Manager
 */
router.get('/:id', categoryController.getById.bind(categoryController));

/**
 * @route   PUT /api/v1/admin/categories/:id
 * @desc    Update a category
 * @access  Admin, Inventory Manager
 */
router.put('/:id', categoryController.update.bind(categoryController));

/**
 * @route   DELETE /api/v1/admin/categories/:id
 * @desc    Delete a category (soft delete)
 * @access  Admin, Inventory Manager
 */
router.delete('/:id', categoryController.delete.bind(categoryController));

export default router;
