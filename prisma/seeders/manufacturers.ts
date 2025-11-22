/**
 * Seeder: manufacturers
 * Uses exact Prisma model `manufacturer` fields.
 * Idempotent via upsert on `manufacturer_code`.
 */
import { PrismaClient } from '@prisma/client';

export async function seedManufacturers(prisma: PrismaClient) {
  console.log('  - Seeding manufacturers...');

  const data = [
    { manufacturer_code: 'MFG-00001', manufacturer_name: 'Nissan Diesel', created_by: 'seeder' },
    { manufacturer_code: 'MFG-00002', manufacturer_name: 'Daewoo Bus', created_by: 'seeder' },
    { manufacturer_code: 'MFG-00003', manufacturer_name: 'Mitsubishi Fuso', created_by: 'seeder' },
    { manufacturer_code: 'MFG-00004', manufacturer_name: 'Iveco', created_by: 'seeder' },
  ];

  for (const m of data) {
    await prisma.manufacturer.upsert({
      where: { manufacturer_code: m.manufacturer_code },
      update: { ...m, updated_by: 'seeder' },
      create: m,
    });
  }

  console.log('    ✅ manufacturers seeded');
}
