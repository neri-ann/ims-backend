/**
 * Seeder: disposals
 * - Creates disposals referencing items, batches, stocks, and buses.
 * - Uses unique `disposal_code` and skips existing codes to maintain idempotency.
 */
import { PrismaClient } from '@prisma/client';

export async function seedDisposals(prisma: PrismaClient) {
  console.log('  - Seeding disposals...');

  const stocks = await prisma.stock.findMany();
  const batches = await prisma.batch.findMany();
  const buses = await prisma.bus.findMany();

  const candidates = [] as any[];

  if (stocks[0] && batches[0]) {
    candidates.push({ disposal_code: 'DISP-00001', stock: { connect: { id: stocks[0].id } }, batch: { connect: { id: batches[0].id } }, quantity: '5.00', disposal_date: new Date(Date.now() - 10*24*60*60*1000), disposal_method: 'SCRAPPED', description: 'Worn out - scrapped', created_by: 'seeder' });
  }

  if (stocks[1] && batches[1]) {
    candidates.push({ disposal_code: 'DISP-00002', stock: { connect: { id: stocks[1].id } }, batch: { connect: { id: batches[1].id } }, quantity: '2.00', disposal_date: new Date(Date.now() - 40*24*60*60*1000), disposal_method: 'FOR_SALE', description: 'Sell to buyer', created_by: 'seeder' });
  }

  if (buses[0]) {
    // disposal for a bus (has bus_id)
    candidates.push({ disposal_code: 'DISP-00003', bus: { connect: { id: buses[0].id } }, disposal_date: new Date(Date.now() - 365*24*60*60*1000), disposal_method: 'FOR_SALE', description: 'Decommissioned unit sold', created_by: 'seeder' });
  }

  // Add more bus disposals with PENDING status
  if (buses[1]) {
    candidates.push({ disposal_code: 'DISP-BUS-0001', bus: { connect: { id: buses[1].id } }, disposal_date: new Date(Date.now() - 30*24*60*60*1000), disposal_method: 'SCRAPPED', description: 'Bus scrapped due to damage', created_by: 'seeder' });
  }

  if (buses[2]) {
    candidates.push({ disposal_code: 'DISP-BUS-0002', bus: { connect: { id: buses[2].id } }, disposal_date: new Date(Date.now() - 60*24*60*60*1000), disposal_method: 'FOR_SALE', description: 'Selling old bus', created_by: 'seeder' });
  }

  if (buses[3]) {
    candidates.push({ disposal_code: 'DISP-BUS-0003', bus: { connect: { id: buses[3].id } }, disposal_date: new Date(Date.now() - 90*24*60*60*1000), disposal_method: 'DONATED', description: 'Donated to charity', created_by: 'seeder' });
  }

  if (buses[4]) {
    candidates.push({ disposal_code: 'DISP-BUS-0004', bus: { connect: { id: buses[4].id } }, disposal_date: new Date(Date.now() - 120*24*60*60*1000), disposal_method: 'WRITTEN_OFF', description: 'Written off due to age', created_by: 'seeder' });
  }

  if (stocks[2] && batches[2]) {
    candidates.push({ disposal_code: 'DISP-00004', stock: { connect: { id: stocks[2].id } }, batch: { connect: { id: batches[2].id } }, quantity: '1.00', disposal_date: new Date(), disposal_method: 'WRITTEN_OFF', description: 'Inventory write-off', created_by: 'seeder' });
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
