import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.bus.count();
  const active = await prisma.bus.count({ where: { status: 'ACTIVE' } });
  console.log(`BUS TOTAL: ${total}`);
  console.log(`BUS ACTIVE: ${active}`);
}

main()
  .catch(e => { console.error('ERROR:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
