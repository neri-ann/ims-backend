/**
 * Seeder: stocks
 * - Creates 10-20 `stock` records referencing existing `item` records.
 * - Uses upsert by `item_code` (stock has @@unique([item_code])).
 * - Uses decimal strings for `current_stock` and `reorder_level` to match @db.Decimal.
 */
import { PrismaClient } from '@prisma/client';

export async function seedStocks(prisma: PrismaClient) {
  console.log('  - Seeding stocks...');

  // pick items to create stocks for
  const targetItemCodes = ['ITM-00001', 'ITM-00002', 'ITM-00003', 'ITM-00004', 'ITM-00005', 'ITM-00006', 'ITM-00007', 'ITM-00008', 'ITM-00009', 'ITM-00010', 'ITM-00011', 'ITM-00012'];
  const items = await prisma.item.findMany({ where: { item_code: { in: targetItemCodes } } });

  if (items.length === 0) {
    console.warn('    ⚠️ No items found to create stocks for. Seed items first.');
    return;
  }

  const statuses = ['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'IN_USE', 'UNDER_MAINTENANCE', 'EXPIRED', 'DISPOSED', 'NOT_AVAILABLE', 'INACTIVE'] as const;

  let created = 0;

  for (let i = 0; i < items.length && i < 20; i++) {
    const it = items[i];
    if (!it.item_code) {
      console.warn(`    ⚠️ Item ${it.id} has no item_code, skipping.`);
      continue;
    }

    const payload = {
      item_code: it.item_code,
      current_stock: (Math.max(0, 50 - i * 2)).toFixed(2),
      reorder_level: (5 + (i % 7)).toFixed(2),
      status: statuses[i % statuses.length],
      created_by: 'seeder',
    } as any;

    await prisma.stock.upsert({
      where: { item_code: it.item_code },
      update: { ...payload, updated_by: 'seeder' },
      create: payload,
    });

    created++;
  }

  console.log(`    ✅ Upserted ${created} stock records`);
}
