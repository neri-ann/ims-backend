/**
 * Seeder: body_builders
 * Uses exact Prisma model `body_builder` fields.
 * Idempotent via upsert on `body_builder_code`.
 */
import { PrismaClient } from '@prisma/client';

export async function seedBodyBuilders(prisma: PrismaClient) {
  console.log('  - Seeding body builders...');

  const data = [
    { body_builder_code: 'BB-00001', body_builder_name: 'DARJ', created_by: 'seeder' },
    { body_builder_code: 'BB-00002', body_builder_name: 'Agila', created_by: 'seeder' },
    { body_builder_code: 'BB-00003', body_builder_name: 'Hilltop', created_by: 'seeder' },
  ];

  for (const b of data) {
    await prisma.body_builder.upsert({
      where: { body_builder_code: b.body_builder_code },
      update: { ...b, updated_by: 'seeder' },
      create: b,
    });
  }

  console.log('    ✅ body builders seeded');
}
