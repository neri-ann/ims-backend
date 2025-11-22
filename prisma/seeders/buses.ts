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

  // find a stock to attach to some buses (if present)
  const stockForTire = await prisma.stock.findFirst({ where: {}, include: { item: true } });

  const buses = [
    {
      plate_number: 'PLATE-0001', body_number: 'BODY-0001', body_builder_id: bb1?.id || 1, manufacturer_id: m1?.id || 1,
      bus_type: 'AIRCONDITIONED' as const, condition: 'BRAND_NEW' as const, status: 'ACTIVE' as const,
      chassis_number: 'CHS-0001', engine_number: 'ENG-0001', seat_capacity: 45, model: 'X1', year_model: 2025,
      acquisition_date: new Date(), acquisition_method: 'PURCHASED' as const, registration_status: 'REGISTERED' as const,
      brand_new_details: { dealer_name: 'Dealer One', dealer_contact: '+63-2-111-1111' },
      stock_id: stockForTire?.id,
    },
    {
      plate_number: 'PLATE-0002', body_number: 'BODY-0002', body_builder_id: bb2?.id || 1, manufacturer_id: m2?.id || 2,
      bus_type: 'ORDINARY' as const, condition: 'SECOND_HAND' as const, status: 'ACTIVE' as const,
      chassis_number: 'CHS-0002', engine_number: 'ENG-0002', seat_capacity: 40, model: 'S2', year_model: 2018,
      acquisition_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), acquisition_method: 'PURCHASED' as const, registration_status: 'NEEDS_RENEWAL' as const,
      second_hand_details: { previous_owner: 'Old Operator Co.', previous_owner_contact: '+63-917-222-2222', source: 'COMPANY_FLEET' as const, odometer_reading: '120000.00' },
    },
    {
      plate_number: 'PLATE-0003', body_number: 'BODY-0003', body_builder_id: bb1?.id || 1, manufacturer_id: m2?.id || 2,
      bus_type: 'AIRCONDITIONED' as const, condition: 'SECOND_HAND' as const, status: 'UNDER_MAINTENANCE' as const,
      chassis_number: 'CHS-0003', engine_number: 'ENG-0003', seat_capacity: 48, model: 'X2', year_model: 2020,
      acquisition_date: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), acquisition_method: 'PURCHASED' as const, registration_status: 'REGISTERED' as const,
      second_hand_details: { previous_owner: 'Jane Doe', previous_owner_contact: '+63-918-333-3333', source: 'AUCTION' as const, odometer_reading: '80000.00' },
      stock_id: null,
    },
    {
      plate_number: 'PLATE-0004', body_number: 'BODY-0004', body_builder_id: bb2?.id || 2, manufacturer_id: m1?.id || 1,
      bus_type: 'ORDINARY' as const, condition: 'BRAND_NEW' as const, status: 'ACTIVE' as const,
      chassis_number: 'CHS-0004', engine_number: 'ENG-0004', seat_capacity: 42, model: 'Z3', year_model: 2025,
      acquisition_date: new Date(), acquisition_method: 'PURCHASED' as const, registration_status: 'REGISTERED' as const,
      brand_new_details: { dealer_name: 'Dealer B', dealer_contact: '+63-2-222-2222' },
    },
  ];

  let created = 0;

  for (const b of buses) {
    const exists = await prisma.bus.findUnique({ where: { plate_number: b.plate_number } });
    if (exists) continue;

    const nested: any = {
      plate_number: b.plate_number,
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

    if (b.stock_id !== undefined) nested.stock_id = b.stock_id;
    if (b.brand_new_details) nested.brand_new_details = { create: b.brand_new_details };
    if (b.second_hand_details) nested.second_hand_details = { create: b.second_hand_details };

    await prisma.bus.create({ data: nested });
    created++;
  }

  console.log(`    ✅ Created ${created} buses (and nested details)`);
}
