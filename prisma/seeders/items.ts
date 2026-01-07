/**
 * Seeder: items
 * Uses exact Prisma model `item` fields.
 * Upserts by `item_code` to be idempotent.
 * Assumes categories and units are already seeded.
 */
import { PrismaClient, item_status } from '@prisma/client';

export async function seedItems(prisma: PrismaClient) {
  console.log('  - Seeding items...');

  // fetch categories and units
  const [cat1, cat2, cat3, cat4] = await Promise.all([
    prisma.category.findUnique({ where: { category_code: 'CAT-00001' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00002' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00003' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00004' } }),
  ]);

  const [unit1, unit3, unit4, unit6] = await Promise.all([
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00001' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00003' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00004' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00006' } }),
  ]);

  const items = [
    { item_code: 'ITM-00001', item_name: 'Engine Oil 5W-30', category_id: cat1!.id, unit_id: unit6!.id, status: item_status.ACTIVE, description: 'Synthetic engine oil', created_by: 'seeder' },
    { item_code: 'ITM-00002', item_name: 'Brake Fluid DOT 4', category_id: cat1!.id, unit_id: unit6!.id, status: item_status.ACTIVE, description: 'Brake fluid', created_by: 'seeder' },
    { item_code: 'ITM-00003', item_name: 'Coolant/Antifreeze', category_id: cat1!.id, unit_id: unit6!.id, status: item_status.ACTIVE, description: 'Coolant', created_by: 'seeder' },
    { item_code: 'ITM-00004', item_name: 'Transmission Oil', category_id: cat1!.id, unit_id: unit6!.id, status: item_status.ACTIVE, description: 'Transmission oil', created_by: 'seeder' },
    { item_code: 'ITM-00005', item_name: 'Air Filter', category_id: cat3!.id, unit_id: unit1!.id, status: item_status.ACTIVE, description: 'Air filter', created_by: 'seeder' },
    { item_code: 'ITM-00006', item_name: 'Oil Filter', category_id: cat3!.id, unit_id: unit1!.id, status: item_status.ACTIVE, description: 'Oil filter', created_by: 'seeder' },
    { item_code: 'ITM-00007', item_name: 'Brake Pads Set', category_id: cat3!.id, unit_id: unit3!.id, status: item_status.ACTIVE, description: 'Brake pads', created_by: 'seeder' },
    { item_code: 'ITM-00008', item_name: 'Wiper Blades', category_id: cat3!.id, unit_id: unit1!.id, status: item_status.ACTIVE, description: 'Wiper blades', created_by: 'seeder' },
    { item_code: 'ITM-00009', item_name: 'Battery 12V 200Ah', category_id: cat3!.id, unit_id: unit4!.id, status: item_status.ACTIVE, description: 'Battery', created_by: 'seeder' },
    { item_code: 'ITM-00010', item_name: 'Tire 11R22.5', category_id: cat3!.id, unit_id: unit1!.id, status: item_status.ACTIVE, description: 'Tire', created_by: 'seeder' },
    { item_code: 'ITM-00011', item_name: 'Torque Wrench Set', category_id: cat4!.id, unit_id: unit3!.id, status: item_status.ACTIVE, description: 'Torque wrench set', created_by: 'seeder' },
    { item_code: 'ITM-00012', item_name: 'Socket Set', category_id: cat4!.id, unit_id: unit3!.id, status: item_status.ACTIVE, description: 'Socket set', created_by: 'seeder' },
    { item_code: 'ITM-00013', item_name: 'Screwdriver Set', category_id: cat4!.id, unit_id: unit3!.id, status: item_status.ACTIVE, description: 'Screwdriver set', created_by: 'seeder' },
    { item_code: 'ITM-00014', item_name: 'Hydraulic Jack', category_id: cat2!.id, unit_id: unit4!.id, status: item_status.ACTIVE, description: 'Hydraulic jack', created_by: 'seeder' },
    { item_code: 'ITM-00015', item_name: 'Air Compressor', category_id: cat2!.id, unit_id: unit4!.id, status: item_status.ACTIVE, description: 'Air compressor', created_by: 'seeder' },
  ];

  for (const it of items) {
    await prisma.item.upsert({
      where: { item_code: it.item_code },
      update: { ...it, updated_by: 'seeder' },
      create: it,
    });
  }

  console.log('    ✅ items seeded');
}
