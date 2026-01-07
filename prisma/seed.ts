/**
 * Master Seed Script
 * Runs all seed scripts in sequence
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

console.log('🌱 Starting database seeding...\n');

async function run() {
  try {
    // Keep enum seeding script (no-op but preserved)
    console.log('📦 Step 1: Seeding enums...');
    execSync('npx tsx prisma/seed_enums.ts', { stdio: 'inherit' });

    // Use modular seeders for core data to ensure correct ordering and idempotency
    const prisma = new PrismaClient();
    try {
      console.log('\n📦 Step 2: Seeding categories & units...');
      const { seedCategories } = await import('./seeders/categories');
      const { seedUnits } = await import('./seeders/unit_measures');
      await seedCategories(prisma);
      await seedUnits(prisma);

      console.log('\n📦 Step 3: Seeding manufacturers & body builders...');
      const { seedManufacturers } = await import('./seeders/manufacturers');
      const { seedBodyBuilders } = await import('./seeders/body_builders');
      await seedManufacturers(prisma);
      await seedBodyBuilders(prisma);

      console.log('\n📦 Step 4: Seeding items...');
      const { seedItems } = await import('./seeders/items');
      await seedItems(prisma);

      console.log('\n📦 Step 5: Seeding suppliers & supplier_items...');
      const { seedSuppliers } = await import('./seeders/suppliers');
      await seedSuppliers(prisma);

      console.log('\n📦 Step 6: Seeding stocks...');
      const { seedStocks } = await import('./seeders/stocks');
      await seedStocks(prisma);

      console.log('\n📦 Step 7: Seeding batches...');
      const { seedBatches } = await import('./seeders/batches');
      await seedBatches(prisma);

      console.log('\n📦 Step 8: Seeding buses and details...');
      const { seedBuses } = await import('./seeders/buses');
      await seedBuses(prisma);

      console.log('\n📦 Step 9: Seeding disposals...');
      const { seedDisposals } = await import('./seeders/disposals');
      await seedDisposals(prisma);

      // Verification counts
      console.log('\n🔎 Verification counts:');
      const counts = await Promise.all([
        prisma.category.count(),
        prisma.unit_measure.count(),
        prisma.item.count(),
        prisma.supplier.count(),
        prisma.manufacturer.count(),
        prisma.body_builder.count(),
        prisma.stock.count(),
        prisma.batch.count(),
        prisma.bus.count(),
        prisma.second_hand_details.count(),
        prisma.brand_new_details.count(),
        prisma.disposal.count(),
      ]);

      console.log(`- categories: ${counts[0]}`);
      console.log(`- unit_measures: ${counts[1]}`);
      console.log(`- items: ${counts[2]}`);
      console.log(`- suppliers: ${counts[3]}`);
      console.log(`- manufacturers: ${counts[4]}`);
      console.log(`- body_builders: ${counts[5]}`);
      console.log(`- stocks: ${counts[6]}`);
      console.log(`- batches: ${counts[7]}`);
      console.log(`- buses: ${counts[8]}`);
      console.log(`- second_hand_details: ${counts[9]}`);
      console.log(`- brand_new_details: ${counts[10]}`);
      console.log(`- disposals: ${counts[11]}`);

      console.log('\n✅ All seeding completed successfully!');
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

run();
