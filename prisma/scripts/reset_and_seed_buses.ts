import { PrismaClient } from '@prisma/client';
import { seedBuses } from '../seeders/buses';

const prisma = new PrismaClient();

async function main() {
  console.log('🔁 Resetting buses (nullify disposals, delete buses)');

  // Nullify disposal.bus_id to avoid Restrict on delete
  await prisma.disposal.updateMany({
    where: { NOT: { bus_id: null } },
    data: { bus_id: null },
  });

  // Delete all buses (will cascade details)
  const deleted = await prisma.bus.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.count} existing buses`);

  // Run the seeder
  console.log('🌱 Running bus seeder...');
  await seedBuses(prisma);

  // Verify counts
  const total = await prisma.bus.count();
  const active = await prisma.bus.count({ where: { status: 'ACTIVE' } });
  console.log(`BUS TOTAL: ${total}`);
  console.log(`BUS ACTIVE: ${active}`);
}

main()
  .catch(e => {
    console.error('ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
