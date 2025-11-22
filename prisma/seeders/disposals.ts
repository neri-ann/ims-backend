/**
 * Seeder: disposals
 * - Creates disposals referencing items, batches, stocks, and buses.
 * - Uses unique `disposal_code` and skips existing codes to maintain idempotency.
 */
import { PrismaClient } from '@prisma/client';

export async function seedDisposals(prisma: PrismaClient) {
  console.log('  - Seeding disposals...');

  const items = await prisma.item.findMany({ where: { item_code: { in: ['ITM-00001','ITM-00005','ITM-00009'] } } });
  const stocks = await prisma.stock.findMany();
  const batches = await prisma.batch.findMany();
  const buses = await prisma.bus.findMany();

  const candidates = [] as any[];

  if (items[0] && stocks[0] && batches[0]) {
    candidates.push({ disposal_code: 'DISP-00001', item_id: items[0].id, stock_id: stocks[0].id, batch_id: batches[0].id, quantity: '5.00', disposal_date: new Date(Date.now() - 10*24*60*60*1000), disposal_method: 'SCRAPPED', description: 'Worn out - scrapped', actual_value: '0.00', created_by: 'seeder' });
  }

  if (items[1] && stocks[1] && batches[1]) {
    candidates.push({ disposal_code: 'DISP-00002', item_id: items[1].id, stock_id: stocks[1].id, batch_id: batches[1].id, quantity: '2.00', disposal_date: new Date(Date.now() - 40*24*60*60*1000), disposal_method: 'SOLD', description: 'Sold to buyer', estimated_value: '1500.00', actual_value: '1400.00', created_by: 'seeder' });
  }

  if (buses[0]) {
    // disposal for a bus (has bus_id)
    candidates.push({ disposal_code: 'DISP-00003', bus_id: buses[0].id, disposal_date: new Date(Date.now() - 365*24*60*60*1000), disposal_method: 'SOLD', description: 'Decommissioned unit sold', estimated_value: '200000.00', actual_value: '180000.00', created_by: 'seeder' });
  }

  if (items[2] && stocks[2]) {
    candidates.push({ disposal_code: 'DISP-00004', item_id: items[2].id, stock_id: stocks[2].id, quantity: '1.00', disposal_date: new Date(), disposal_method: 'WRITTEN_OFF', description: 'Inventory write-off', actual_value: '0.00', created_by: 'seeder' });
  }

  let created = 0;
  for (const d of candidates) {
    const exists = await prisma.disposal.findUnique({ where: { disposal_code: d.disposal_code } });
    if (exists) continue;
    await prisma.disposal.create({ data: d });
    created++;
  }

  console.log(`    ✅ Created ${created} disposals`);
}
