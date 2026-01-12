import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  console.log('🌱 Seeding buses (simple version)...');

  const buses = [
    {
      bus_code: 'BUS-0001', plate_number: 'PLATE-0001', body_number: 'BODY-0001', body_builder_id: 1, manufacturer_id: 1,
      bus_type: 'AIRCONDITIONED', condition: 'BRAND_NEW', status: 'ACTIVE',
      chassis_number: 'CHS-0001', engine_number: 'ENG-0001', seat_capacity: 45, model: 'X1', year_model: 2025,
      acquisition_date: new Date(), acquisition_method: 'PURCHASED', registration_status: 'REGISTERED',
      created_by: 'simple-seeder',
    },
    {
      bus_code: 'BUS-0002', plate_number: 'PLATE-0002', body_number: 'BODY-0002', body_builder_id: 2, manufacturer_id: 2,
      bus_type: 'ORDINARY', condition: 'SECOND_HAND', status: 'ACTIVE',
      chassis_number: 'CHS-0002', engine_number: 'ENG-0002', seat_capacity: 40, model: 'S2', year_model: 2018,
      acquisition_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), acquisition_method: 'PURCHASED', registration_status: 'NEEDS_RENEWAL',
      created_by: 'simple-seeder',
    },
    {
      bus_code: 'BUS-0003', plate_number: 'PLATE-0003', body_number: 'BODY-0003', body_builder_id: 1, manufacturer_id: 2,
      bus_type: 'AIRCONDITIONED', condition: 'SECOND_HAND', status: 'UNDER_MAINTENANCE',
      chassis_number: 'CHS-0003', engine_number: 'ENG-0003', seat_capacity: 48, model: 'X2', year_model: 2020,
      acquisition_date: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), acquisition_method: 'PURCHASED', registration_status: 'REGISTERED',
      created_by: 'simple-seeder',
    },
    {
      bus_code: 'BUS-0004', plate_number: 'PLATE-0004', body_number: 'BODY-0004', body_builder_id: 2, manufacturer_id: 1,
      bus_type: 'ORDINARY', condition: 'BRAND_NEW', status: 'ACTIVE',
      chassis_number: 'CHS-0004', engine_number: 'ENG-0004', seat_capacity: 42, model: 'Z3', year_model: 2025,
      acquisition_date: new Date(), acquisition_method: 'PURCHASED', registration_status: 'REGISTERED',
      created_by: 'simple-seeder',
    },
  ];

  let created = 0;
  for (const b of buses) {
    const exists = await prisma.bus.findUnique({ where: { plate_number: b.plate_number } });
    if (exists) continue;
    await prisma.bus.create({ data: b });
    created++;
  }

  console.log(`✅ Created ${created} buses`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
