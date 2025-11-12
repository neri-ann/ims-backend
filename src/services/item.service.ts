/**
 * Item Service
 * Business logic for item management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors';

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

    const where: Prisma.ItemWhereInput = {
      isDeleted: false,
      ...(filters.status && { status: filters.status }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.search && {
        OR: [
          { itemCode: { contains: filters.search, mode: 'insensitive' } },
          { itemName: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.ItemOrderByWithRelationInput = {
      [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          unit: true,
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
      where: { id, isDeleted: false },
      include: {
        category: true,
        unit: true,
        stocks: true,
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
      where: { itemCode, isDeleted: false },
      include: {
        category: true,
        unit: true,
        stocks: true,
      },
    });

    if (!item) {
      throw new NotFoundError(`Item with code ${itemCode} not found`);
    }

    return item;
  }

  /**
   * Create new item
   */
  async createItem(data: ItemCreateData, userId: string) {
    // Check if item code already exists
    const existing = await prisma.item.findUnique({
      where: { itemCode: data.itemCode },
    });

    if (existing && !existing.isDeleted) {
      throw new ConflictError(`Item with code ${data.itemCode} already exists`);
    }

    // Verify category exists
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, isDeleted: false },
    });
    if (!category) {
      throw new BadRequestError('Invalid category ID');
    }

    // Verify unit exists
    const unit = await prisma.unitMeasure.findFirst({
      where: { id: data.unitId, isDeleted: false },
    });
    if (!unit) {
      throw new BadRequestError('Invalid unit ID');
    }

    const item = await prisma.item.create({
      data: {
        ...data,
        createdBy: userId,
      },
      include: {
        category: true,
        unit: true,
      },
    });

    logger.info(`Item created: ${item.itemCode}`, { userId });
    return item;
  }

  /**
   * Update item
   */
  async updateItem(id: number, data: ItemUpdateData, userId: string) {
    const existing = await prisma.item.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }

    // If updating item code, check for duplicates
    if (data.itemCode && data.itemCode !== existing.itemCode) {
      const duplicate = await prisma.item.findFirst({
        where: { itemCode: data.itemCode, isDeleted: false },
      });
      if (duplicate) {
        throw new ConflictError(`Item with code ${data.itemCode} already exists`);
      }
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
      include: {
        category: true,
        unit: true,
      },
    });

    logger.info(`Item updated: ${item.itemCode}`, { userId });
    return item;
  }

  /**
   * Soft delete item
   */
  async deleteItem(id: number, userId: string) {
    const existing = await prisma.item.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw new NotFoundError(`Item with ID ${id} not found`);
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date(),
      },
    });

    logger.info(`Item deleted: ${item.itemCode}`, { userId });
    return { success: true, message: 'Item deleted successfully' };
  }
}

export const itemService = new ItemService();
