/**
 * Item Service
 * Business logic for item management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors';
import { generateId } from '../lib/idGenerator';

// ===========================
// Types & Interfaces
// ===========================

export interface ItemCreateData {
  itemCode: string;
  itemName: string;
  categoryId: number;
  unitId: number;
  status?: 'ACTIVE' | 'INACTIVE';
  description?: string;
}

export interface ItemUpdateData extends Partial<ItemCreateData> {}

export interface ItemListFilters {
  page?: number;
  limit?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  categoryId?: number;
  search?: string; // Search in itemCode, itemName
  sortBy?: 'itemCode' | 'itemName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ===========================
// Item Service Class
// ===========================

export class ItemService {
  /**
   * List items with pagination and filters
   */
  async listItems(filters: ItemListFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.itemWhereInput = {
      is_deleted: false,
      ...(filters.status && { status: filters.status }),
      ...(filters.categoryId && { category_id: filters.categoryId }),
      ...(filters.search && {
        OR: [
          { item_code: { contains: filters.search, mode: 'insensitive' } },
          { item_name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const sortFieldMap: Record<string, string> = {
      itemCode: 'item_code',
      itemName: 'item_name',
      createdAt: 'created_at',
    };
    const sortField = sortFieldMap[filters.sortBy || 'createdAt'] || 'created_at';
    const orderBy = { [sortField]: filters.sortOrder || 'desc' } as Prisma.itemOrderByWithRelationInput;

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          unit: true,
          _count: {
            select: {
              supplier_items: { where: { is_deleted: false } },
            },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get item by ID
   */
  async getItemById(id: number) {
    const item = await prisma.item.findFirst({
      where: { id, is_deleted: false },
      include: {
        category: true,
        unit: true,
        stocks: true,
        _count: {
          select: { supplier_items: { where: { is_deleted: false } } },
        },
      },
    });

    if (!item) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }

    return item;
  }

  /**
   * Get item by code
   */
  async getItemByCode(itemCode: string) {
    const item = await prisma.item.findFirst({
      where: { item_code: itemCode, is_deleted: false },
      include: {
        category: true,
        unit: true,
        stocks: true,
        _count: {
          select: { supplier_items: { where: { is_deleted: false } } },
        },
      },
    });

    if (!item) {
      return null;
    }

    return item;
  }

  /**
   * Create new item
   */
  async createItem(data: ItemCreateData, userId: string) {
    // Verify category exists
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, is_deleted: false },
    });
    if (!category) {
      throw new BadRequestError('Invalid category ID');
    }

    // Verify unit exists
    const unit = await prisma.unit_measure.findFirst({
      where: { id: data.unitId, is_deleted: false },
    });
    if (!unit) {
      throw new BadRequestError('Invalid unit ID');
    }

    // Check if item name already exists
    const existingByName = await prisma.item.findFirst({
      where: { 
        item_name: data.itemName,
        is_deleted: false
      },
    });

    if (existingByName) {
      throw new ConflictError(`Item with name "${data.itemName}" already exists`);
    }

    // Generate item code
    const itemCode = data.itemCode || await generateId('item', 'ITM');

    // Check if generated code already exists (edge case)
    const existingByCode = await prisma.item.findFirst({
      where: { 
        item_code: itemCode,
        is_deleted: false
      },
    });

    if (existingByCode) {
      throw new ConflictError(`Item with code ${itemCode} already exists`);
    }

    const item = await prisma.item.create({
      data: {
        item_code: itemCode,
        item_name: data.itemName,
        category_id: data.categoryId,
        unit_id: data.unitId,
        status: data.status || 'ACTIVE',
        description: data.description,
        created_by: userId,
      },
      include: {
        category: true,
        unit: true,
      },
    });

    logger.info(`Item created: ${item.item_code}`, { userId });
    return item;
  }

  /**
   * Create unrecorded item (from purchase request)
   * Items created this way have is_recorded=false for pending approval
   */
  async createUnrecordedItem(data: {
    itemName: string;
    unitId?: number;
    unitName?: string;
    description?: string;
    createdBy?: string;
  }) {
    // Check if item already exists
    const existing = await prisma.item.findFirst({
      where: {
        item_name: data.itemName,
        is_deleted: false,
      },
    });

    if (existing) {
      return existing;
    }

    // Get or create unit
    let unitId = data.unitId;
    if (!unitId && data.unitName) {
      const unit = await prisma.unit_measure.findFirst({
        where: {
          unit_name: data.unitName,
          is_deleted: false,
        },
      });

      if (unit) {
        unitId = unit.id;
      } else {
        // Create unit (no is_recorded field in unit_measure table)
        const newUnit = await prisma.unit_measure.create({
          data: {
            unit_code: await generateId('unit', 'UNT'),
            unit_name: data.unitName,
            created_by: data.createdBy || 'purchase-request',
          },
        });
        unitId = newUnit.id;
      }
    }

    // Default to first category if not specified (Uncategorized/General)
    const defaultCategory = await prisma.category.findFirst({
      where: { is_deleted: false },
      orderBy: { id: 'asc' },
    });

    const item = await prisma.item.create({
      data: {
        item_code: await generateId('item', 'ITM'),
        item_name: data.itemName,
        category_id: defaultCategory?.id || 1,
        unit_id: unitId || 1,
        status: 'ACTIVE',
        description: data.description,
        is_recorded: false,
        created_by: data.createdBy || 'purchase-request',
      },
      include: {
        category: true,
        unit: true,
      },
    });

    logger.info(`Unrecorded item created: ${item.item_code}`);
    return item;
  }

  /**
   * Update item
   */
  async updateItem(id: number, data: ItemUpdateData, userId: string) {
    const existing = await prisma.item.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }

    // If updating item code, check for duplicates
    if (data.itemCode && data.itemCode !== existing.item_code) {
      const duplicate = await prisma.item.findFirst({
        where: { item_code: data.itemCode, is_deleted: false },
      });
      if (duplicate) {
        throw new ConflictError(`Item with code ${data.itemCode} already exists`);
      }
    }

  const updateData: Partial<Prisma.itemUncheckedUpdateInput> = {};
    if (data.itemCode) updateData.item_code = data.itemCode;
    if (data.itemName) updateData.item_name = data.itemName;
    if (typeof data.categoryId !== 'undefined') updateData.category_id = data.categoryId;
    if (typeof data.unitId !== 'undefined') updateData.unit_id = data.unitId;
    if (typeof data.status !== 'undefined') updateData.status = data.status;
    if (typeof data.description !== 'undefined') updateData.description = data.description;
    updateData.updated_by = userId;

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        unit: true,
      },
    });

    logger.info(`Item updated: ${item.item_code}`, { userId });
    return item;
  }

  /**
   * Soft delete item
   */
  async deleteItem(id: number, userId: string) {
    const existing = await prisma.item.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date(),
      },
    });

    logger.info(`Item deleted: ${item.item_code}`, { userId });
    return { success: true, message: 'Item deleted successfully' };
  }
}

export const itemService = new ItemService();
