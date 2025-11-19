import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export class CategoryService {
  async list() {
    const categories = await prisma.category.findMany({ where: { is_deleted: false }, orderBy: { category_name: 'asc' } });
    return { categories };
  }

  async getById(id: number) {
    const c = await prisma.category.findUnique({ where: { id } });
    if (!c || c.is_deleted) throw new NotFoundError('Category not found');
    return c;
  }
}

export const categoryService = new CategoryService();
