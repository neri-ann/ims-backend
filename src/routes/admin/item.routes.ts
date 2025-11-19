/**
 * Item Routes (Admin)
 * RESTful API endpoints fors item management
 * Requires admin authentication and authorization
 */

import { Router } from 'express';
import { itemController } from '../../controllers/item.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin', 'inventory_manager'));

/**
 * @route   GET /api/v1/admin/items
 * @desc    List all items with filters and pagination
 * @access  Admin, Inventory Manager
 */
router.get('/', itemController.listItems.bind(itemController));

/**
 * @route   POST /api/v1/admin/items
 * @desc    Create a new item
 * @access  Admin, Inventory Manager
 */
router.post('/', itemController.createItem.bind(itemController));

/**
 * @route   GET /api/v1/admin/items/:id
 * @desc    Get a single item by ID
 * @access  Admin, Inventory Manager
 */
router.get('/:id', itemController.getItemById.bind(itemController));

/**
 * @route   PUT /api/v1/admin/items/:id
 * @desc    Update an existing item
 * @access  Admin, Inventory Manager
 */
router.put('/:id', itemController.updateItem.bind(itemController));

/**
 * @route   DELETE /api/v1/admin/items/:id
 * @desc    Delete an item (soft delete)
 * @access  Admin, Inventory Manager
 */
router.delete('/:id', itemController.deleteItem.bind(itemController));

export default router;
