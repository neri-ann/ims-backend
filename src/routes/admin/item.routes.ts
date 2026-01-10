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

// All routes except /unrecorded require authentication and admin role
const authMiddleware = [authenticate, authorize('admin', 'inventory_manager')];

/**
 * @route   GET /api/v1/admin/items
 * @desc    List all items with filters and pagination
 * @access  Admin, Inventory Manager
 */
router.get('/', ...authMiddleware, itemController.listItems.bind(itemController));

/**
 * @route   POST /api/v1/admin/items
 * @desc    Create a new item
 * @access  Admin, Inventory Manager
 */
router.post('/', ...authMiddleware, itemController.createItem.bind(itemController));

/**
 * @route   POST /api/v1/admin/items/unrecorded
 * @desc    Create unrecorded item (from purchase request, no auth required)
 * @access  Public (for purchase request integration)
 */
router.post('/unrecorded', itemController.createUnrecordedItem.bind(itemController));

/**
 * @route   GET /api/v1/admin/items/:id
 * @desc    Get a single item by ID
 * @access  Admin, Inventory Manager
 */
router.get('/:id', ...authMiddleware, itemController.getItemById.bind(itemController));

/**
 * @route   PUT /api/v1/admin/items/:id
 * @desc    Update an existing item
 * @access  Admin, Inventory Manager
 */
router.put('/:id', ...authMiddleware, itemController.updateItem.bind(itemController));

/**
 * @route   DELETE /api/v1/admin/items/:id
 * @desc    Delete an item (soft delete)
 * @access  Admin, Inventory Manager
 */
router.delete('/:id', ...authMiddleware, itemController.deleteItem.bind(itemController));

export default router;
