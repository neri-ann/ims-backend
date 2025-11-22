/**
 * Seeder: categories
 * Uses exact Prisma model `category` fields.
 * Idempotent via upsert on `category_code`.
 */
import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
  console.log('  - Seeding categories...');

  const data = [
    { category_code: 'CAT-00001', category_name: 'Consumable', description: 'Consumables and fluids', created_by: 'seeder' },
    { category_code: 'CAT-00002', category_name: 'Machine', description: 'Machine items', created_by: 'seeder' },
    { category_code: 'CAT-00003', category_name: 'Equipment', description: 'Equipment and spare parts', created_by: 'seeder' },
    { category_code: 'CAT-00004', category_name: 'Tool', description: 'Tools and sets', created_by: 'seeder' },
  ];

  for (const c of data) {
    await prisma.category.upsert({
      where: { category_code: c.category_code },
      update: { ...c, updated_by: 'seeder' },
      create: c,
    });
  }

  console.log('    ✅ categories seeded');
}
