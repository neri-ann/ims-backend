/**
 * Seeder: batches
 * - Creates multiple batches per stock (1-3) for many stocks.
 * - Populates batch_number, quantity, received_date, expiration_date where applicable.
 * - Uses skip-if-exists logic to keep idempotent runs safe.
 */
import { PrismaClient } from '@prisma/client';

export async function seedBatches(prisma: PrismaClient) {
  console.log('  - Seeding batches...');

  const stocks = await prisma.stock.findMany({ include: { item: true } });
  if (stocks.length === 0) {
    console.warn('    ⚠️ No stocks found to create batches for. Seed stocks first.');
    return;
  }

  let created = 0;

  for (const s of stocks) {
    // if this stock already has batches, create additional to ensure many have multiple
    const existing = await prisma.batch.findMany({ where: { stock_id: s.id } });
    const already = existing.length;
    const toCreate = already >= 2 ? 0 : (2 - already); // ensure at least 2 total for many stocks

    // create at least 1 for stocks with none
    const ensure = already === 0 ? 1 : 0;
    const total = toCreate + ensure;

    for (let i = 0; i < total; i++) {
      const batchNumber = `BATCH-${s.id}-${(existing.length || 0) + i + 1}`;
      const qty = (10 + Math.floor(Math.random() * 90)).toFixed(2);
      const name = (s as any).item?.item_name || '';
      const isConsumable = /oil|fluid|coolant|transmission/i.test(name);

      const expiration_date = isConsumable ? new Date(Date.now() + (90 + i * 30) * 24 * 60 * 60 * 1000) : undefined;

      await prisma.batch.create({ data: {
        stock_id: s.id,
        batch_number: batchNumber,
        quantity: qty,
        received_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        expiration_date,
        remarks: isConsumable ? 'Consumable batch' : 'Standard batch',
        created_by: 'seeder',
      }});

      created++;
    }
  }

  console.log(`    ✅ Created ${created} batches`);
}
