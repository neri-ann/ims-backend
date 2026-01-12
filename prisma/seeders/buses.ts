/**
 * Seeder: buses (+ nested second_hand_details / brand_new_details)
 * - Creates several buses; some connect to `stock` via `stock_id`, others do not.
 * - Uses nested create for `second_hand_details` or `brand_new_details`.
 * - Upserts by `plate_number` to be idempotent.
 */
import { PrismaClient } from '@prisma/client';

export async function seedBuses(prisma: PrismaClient) {
  console.log('  - Seeding buses and details...');

  // find builders and manufacturers
  const [bb1, bb2] = await Promise.all([
    prisma.body_builder.findUnique({ where: { body_builder_code: 'BB-00001' } }),
    prisma.body_builder.findUnique({ where: { body_builder_code: 'BB-00002' } }),
  ]);

  const [m1, m2] = await Promise.all([
    prisma.manufacturer.findUnique({ where: { manufacturer_code: 'MFG-00001' } }),
    prisma.manufacturer.findUnique({ where: { manufacturer_code: 'MFG-00002' } }),
  ]);

  // Generate 20 buses with unique values
  const buses = Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    const isEven = n % 2 === 0;
    return {
      bus_code: `BUS-${n.toString().padStart(4, '0')}`,
      plate_number: `PLATE-${n.toString().padStart(4, '0')}`,
      body_number: `BODY-${n.toString().padStart(4, '0')}`,
      body_builder_id: isEven ? (bb2?.id || 2) : (bb1?.id || 1),
      manufacturer_id: isEven ? (m2?.id || 2) : (m1?.id || 1),
      bus_type: isEven ? 'ORDINARY' : 'AIRCONDITIONED',
      condition: isEven ? 'SECOND_HAND' : 'BRAND_NEW',
      status: n % 3 === 0 ? 'UNDER_MAINTENANCE' : 'ACTIVE',
      chassis_number: `CHS-${n.toString().padStart(4, '0')}`,
      engine_number: `ENG-${n.toString().padStart(4, '0')}`,
      seat_capacity: 40 + (n % 10),
      model: `Model${String.fromCharCode(65 + (n % 5))}`,
      year_model: 2020 + (n % 6),
      acquisition_date: new Date(Date.now() - n * 30 * 24 * 60 * 60 * 1000),
      acquisition_method: 'PURCHASED',
      registration_status: isEven ? 'NEEDS_RENEWAL' : 'REGISTERED',
      created_by: 'seeder',
      ...(isEven
        ? { second_hand_details: { previous_owner: `Owner ${n}`, previous_owner_contact: `+63-900-000-00${n.toString().padStart(2, '0')}`, source: 'COMPANY_FLEET', odometer_reading: `${100000 + n * 1000}` } }
        : { brand_new_details: { dealer_name: `Dealer ${n}`, dealer_contact: `+63-2-100-10${n.toString().padStart(2, '0')}` } }
      ),
    };
  });
// Allow direct execution
if (require.main === module) {
  const prisma = new PrismaClient();
  seedBuses(prisma)
    .then(() => prisma.$disconnect())
    .catch(e => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}

  let created = 0;

  let updated = 0;

  for (const b of buses) {
    const exists = await prisma.bus.findUnique({ where: { plate_number: b.plate_number } });

    const baseData: any = {
      bus_code: b.bus_code,
      body_number: b.body_number,
      body_builder_id: b.body_builder_id,
      manufacturer_id: b.manufacturer_id,
      bus_type: b.bus_type,
      condition: b.condition,
      status: b.status,
      chassis_number: b.chassis_number,
      engine_number: b.engine_number,
      seat_capacity: b.seat_capacity,
      model: b.model,
      year_model: b.year_model,
      acquisition_date: b.acquisition_date,
      acquisition_method: b.acquisition_method,
      registration_status: b.registration_status,
      created_by: 'seeder',
    };

    let busRecord: any;
    if (exists) {
      busRecord = await prisma.bus.update({ where: { id: exists.id }, data: baseData });
      updated++;
    } else {
      busRecord = await prisma.bus.create({ data: { plate_number: b.plate_number, ...baseData } });
      created++;
    }

    // Upsert details depending on condition
    if (b.brand_new_details) {
      await prisma.brand_new_details.upsert({
        where: { bus_id: busRecord.id },
        update: { ...b.brand_new_details },
        create: { bus_id: busRecord.id, ...b.brand_new_details },
      });
    }

    if (b.second_hand_details) {
      await prisma.second_hand_details.upsert({
        where: { bus_id: busRecord.id },
        update: { ...b.second_hand_details },
        create: { bus_id: busRecord.id, ...b.second_hand_details },
      });
    }
  }

  console.log(`    ✅ Created ${created} buses, updated ${updated} buses (and nested details)`);
  if (created > 0) {
    console.log('✅ Bus seeding completed successfully!');
  } else {
    console.log('✅ No new buses created (all already exist)');
  }
}

