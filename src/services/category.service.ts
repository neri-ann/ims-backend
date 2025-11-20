import { prisma } from '../config/database';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors';
import { generateId } from '../lib/idGenerator';
import { logger } from '../config/logger';

export interface CategoryCreateData {
  category_name: string;
  description?: string;
}

export interface CategoryUpdateData {
  category_name?: string;
  description?: string;
}

export class CategoryService {
  async list() {
    const categories = await prisma.category.findMany({ 
      where: { is_deleted: false }, 
      orderBy: { category_name: 'asc' } 
    });
    return { categories };
  }

  async getById(id: number) {
    const c = await prisma.category.findUnique({ where: { id } });
    if (!c || c.is_deleted) throw new NotFoundError('Category not found');
    return c;
  }

  async create(data: CategoryCreateData, userId?: string) {
    // Validate required fields
    if (!data.category_name || data.category_name.trim() === '') {
      throw new BadRequestError('Category name is required');
    }

    // Check for duplicate category name
    const existing = await prisma.category.findFirst({
      where: {
        category_name: data.category_name,
        is_deleted: false,
      },
    });

    if (existing) {
      throw new ConflictError(`Category "${data.category_name}" already exists`);
    }

    // Generate category code
    const categoryCode = await generateId('category', 'CAT');

    // Create category
    const category = await prisma.category.create({
      data: {
        category_code: categoryCode,
        category_name: data.category_name.trim(),
        description: data.description?.trim() || null,
        created_by: userId || 'system',
      },
    });

    logger.info(`Category created: ${category.category_name}`, { userId });
    return category;
  }

  async update(id: number, data: CategoryUpdateData, userId?: string) {
    // Check if category exists
    const existing = await prisma.category.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundError('Category not found');
    }

    // If updating name, check for duplicates
    if (data.category_name && data.category_name !== existing.category_name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          category_name: data.category_name,
          is_deleted: false,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new ConflictError(`Category "${data.category_name}" already exists`);
      }
    }

    // Update category
    const updateData: any = {
      updated_by: userId || 'system',
    };

    if (data.category_name !== undefined) {
      updateData.category_name = data.category_name.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Category updated: ${category.category_name}`, { userId });
    return category;
  }

  async delete(id: number, userId?: string) {
    // Check if category exists
    const existing = await prisma.category.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundError('Category not found');
    }

    // Check if category has items
    const itemCount = await prisma.item.count({
      where: {
        category_id: id,
        is_deleted: false,
      },
    });

    if (itemCount > 0) {
      throw new BadRequestError(`Cannot delete category. It has ${itemCount} item(s) associated with it.`);
    }

    // Soft delete
    const category = await prisma.category.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_by: userId || 'system',
        deleted_at: new Date(),
      },
    });

    logger.info(`Category deleted: ${category.category_name}`, { userId });
    return { success: true, message: 'Category deleted successfully' };
  }
}

export const categoryService = new CategoryService();
