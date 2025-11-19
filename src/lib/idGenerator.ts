import { prisma } from '../config/database';

/**
 * Simple ID generator for models that use a CODE field with prefix e.g. SUP-00001
 * Adjusts to the backend Prisma schema field names.
 */
export async function generateId(
  model: 'category' | 'item' | 'unit' | 'supplier' | 'batch',
  prefix: string
): Promise<string> {
  let lastEntry: any = null;
  let field = '';

  switch (model) {
    case 'category':
      field = 'category_code';
      lastEntry = await prisma.category.findFirst({ orderBy: { category_code: 'desc' }, select: { category_code: true } });
      break;
    case 'item':
      field = 'item_code';
      lastEntry = await prisma.item.findFirst({ orderBy: { item_code: 'desc' }, select: { item_code: true } });
      break;
    case 'unit':
      field = 'unit_code';
      lastEntry = await prisma.unit_measure.findFirst({ orderBy: { unit_code: 'desc' }, select: { unit_code: true } });
      break;
    case 'supplier':
      field = 'supplier_code';
      lastEntry = await prisma.supplier.findFirst({ orderBy: { supplier_code: 'desc' }, select: { supplier_code: true } });
      break;
    case 'batch':
      field = 'batch_number';
      lastEntry = await prisma.batch.findFirst({ orderBy: { batch_number: 'desc' }, select: { batch_number: true } });
      break;
    default:
      throw new Error('Unsupported model for ID generation');
  }

  const lastId = lastEntry ? (lastEntry[field] as string) : null;
  const lastNumber = lastId ? parseInt(String(lastId).split('-').pop() || '0', 10) : 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}
