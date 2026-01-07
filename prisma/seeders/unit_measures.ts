/**
 * Seeder: unit_measure
 * Uses exact Prisma model `unit_measure` fields.
 * Idempotent via upsert on `unit_code`.
 */
import { PrismaClient } from '@prisma/client';

export async function seedUnits(prisma: PrismaClient) {
  console.log('  - Seeding unit measures...');

  const data = [
    { unit_code: 'UNT-00001', unit_name: 'Pieces', abbreviation: 'pcs', created_by: 'seeder' },
    { unit_code: 'UNT-00002', unit_name: 'Box', abbreviation: 'box', created_by: 'seeder' },
    { unit_code: 'UNT-00003', unit_name: 'Set', abbreviation: 'set', created_by: 'seeder' },
    { unit_code: 'UNT-00004', unit_name: 'Unit', abbreviation: 'unit', created_by: 'seeder' },
    { unit_code: 'UNT-00005', unit_name: 'Kilogram', abbreviation: 'kg', created_by: 'seeder' },
    { unit_code: 'UNT-00006', unit_name: 'Liter', abbreviation: 'L', created_by: 'seeder' },
  ];

  for (const u of data) {
    await prisma.unit_measure.upsert({
      where: { unit_code: u.unit_code },
      update: { ...u, updated_by: 'seeder' },
      create: u,
    });
  }

  console.log('    ✅ unit measures seeded');
}
