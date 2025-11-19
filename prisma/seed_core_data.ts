/**
 * Seed Core Reference Data
 * Initialize essential inventory data
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding core inventory data...');

  // Seed Categories
  const categories = await prisma.category.createMany({
    data: [
      { 
        category_code: 'CAT-00001', 
        category_name: 'Consumable', 
        description: 'Consumables items and components', 
        created_by: 'system' 
      },
      { 
        category_code: 'CAT-00002', 
        category_name: 'Machine', 
        description: 'Machine Items', 
        created_by: 'system' 
      },
      { 
        category_code: 'CAT-00003', 
        category_name: 'Equipment', 
        description: 'Bus and vehicle spare parts', 
        created_by: 'system' 
      },
      { 
        category_code: 'CAT-00004', 
        category_name: 'Tool', 
        description: 'Maintenance and cleaning supplies', 
        created_by: 'system' 
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${categories.count} categories`);

  // Seed Unit Measures
  const units = await prisma.unit_measure.createMany({
    data: [
      { 
        unit_code: 'UNT-00001', 
        unit_name: 'Pieces', 
        abbreviation: 'pcs', 
        created_by: 'system' 
      },
      { 
        unit_code: 'UNT-00002', 
        unit_name: 'Box', 
        abbreviation: 'box', 
        created_by: 'system' 
      },
      { 
        unit_code: 'UNT-00003', 
        unit_name: 'Set', 
        abbreviation: 'set', 
        created_by: 'system' 
      },
      { 
        unit_code: 'UNT-00004', 
        unit_name: 'Unit', 
        abbreviation: 'unit', 
        created_by: 'system' 
      },
      { 
        unit_code: 'UNT-00005', 
        unit_name: 'Kilogram', 
        abbreviation: 'kg', 
        created_by: 'system' 
      },
      { 
        unit_code: 'UNT-00006', 
        unit_name: 'Liter', 
        abbreviation: 'L', 
        created_by: 'system' 
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${units.count} unit measures`);

  // Seed Body Builders
  const bodyBuilders = await prisma.body_builder.createMany({
    data: [
      { 
        body_builder_code: 'BB-00001', 
        body_builder_name: 'DARJ', 
        created_by: 'system' 
      },
      { 
        body_builder_code: 'BB-00002', 
        body_builder_name: 'Agila', 
        created_by: 'system' 
      },
      { 
        body_builder_code: 'BB-00003', 
        body_builder_name: 'Hilltop', 
        created_by: 'system' 
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${bodyBuilders.count} body builders`);

  // Seed Manufacturers
  const manufacturers = await prisma.manufacturer.createMany({
    data: [
      { 
        manufacturer_code: 'MFG-00001', 
        manufacturer_name: 'Nissan Diesel', 
        created_by: 'system' 
      },
      { 
        manufacturer_code: 'MFG-00002', 
        manufacturer_name: 'Daewoo Bus', 
        created_by: 'system' 
      },
      { 
        manufacturer_code: 'MFG-00003', 
        manufacturer_name: 'Mitsubishi Fuso', 
        created_by: 'system' 
      },
      { 
        manufacturer_code: 'MFG-00004', 
        manufacturer_name: 'Iveco', 
        created_by: 'system' 
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${manufacturers.count} manufacturers`);

  // Fetch created data for relationships
  const [cat1, cat2, cat3, cat4] = await Promise.all([
    prisma.category.findUnique({ where: { category_code: 'CAT-00001' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00002' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00003' } }),
    prisma.category.findUnique({ where: { category_code: 'CAT-00004' } }),
  ]);

  const [unit1, unit2, unit3, unit4, , unit6] = await Promise.all([
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00001' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00002' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00003' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00004' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00005' } }),
    prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00006' } }),
  ]);

  // Seed Items
  const items = await prisma.item.createMany({
    data: [
      // Consumables
      { 
        item_code: 'ITM-00001',
        item_name: 'Engine Oil 5W-30',
        category_id: cat1!.id,
        unit_id: unit6!.id, // Liter
        status: 'ACTIVE',
        description: 'Synthetic engine oil for buses',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00002',
        item_name: 'Brake Fluid DOT 4',
        category_id: cat1!.id,
        unit_id: unit6!.id, // Liter
        status: 'ACTIVE',
        description: 'High-performance brake fluid',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00003',
        item_name: 'Coolant/Antifreeze',
        category_id: cat1!.id,
        unit_id: unit6!.id, // Liter
        status: 'ACTIVE',
        description: 'Engine cooling fluid',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00004',
        item_name: 'Transmission Oil',
        category_id: cat1!.id,
        unit_id: unit6!.id, // Liter
        status: 'ACTIVE',
        description: 'ATF Dexron III transmission oil',
        created_by: 'system'
      },
      // Equipment
      { 
        item_code: 'ITM-00005',
        item_name: 'Air Filter',
        category_id: cat3!.id,
        unit_id: unit1!.id, // Pieces
        status: 'ACTIVE',
        description: 'Engine air filter for buses',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00006',
        item_name: 'Oil Filter',
        category_id: cat3!.id,
        unit_id: unit1!.id, // Pieces
        status: 'ACTIVE',
        description: 'Engine oil filter',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00007',
        item_name: 'Brake Pads Set',
        category_id: cat3!.id,
        unit_id: unit3!.id, // Set
        status: 'ACTIVE',
        description: 'Complete brake pad set for front/rear',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00008',
        item_name: 'Wiper Blades',
        category_id: cat3!.id,
        unit_id: unit1!.id, // Pieces
        status: 'ACTIVE',
        description: 'Heavy-duty windshield wiper blades',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00009',
        item_name: 'Battery 12V 200Ah',
        category_id: cat3!.id,
        unit_id: unit4!.id, // Unit
        status: 'ACTIVE',
        description: 'Heavy-duty bus battery',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00010',
        item_name: 'Tire 11R22.5',
        category_id: cat3!.id,
        unit_id: unit1!.id, // Pieces
        status: 'ACTIVE',
        description: 'Bus tire size 11R22.5',
        created_by: 'system'
      },
      // Tools
      { 
        item_code: 'ITM-00011',
        item_name: 'Torque Wrench Set',
        category_id: cat4!.id,
        unit_id: unit3!.id, // Set
        status: 'ACTIVE',
        description: 'Professional torque wrench set',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00012',
        item_name: 'Socket Set',
        category_id: cat4!.id,
        unit_id: unit3!.id, // Set
        status: 'ACTIVE',
        description: 'Complete socket wrench set',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00013',
        item_name: 'Screwdriver Set',
        category_id: cat4!.id,
        unit_id: unit3!.id, // Set
        status: 'ACTIVE',
        description: 'Professional screwdriver set',
        created_by: 'system'
      },
      // Machine
      { 
        item_code: 'ITM-00014',
        item_name: 'Hydraulic Jack',
        category_id: cat2!.id,
        unit_id: unit4!.id, // Unit
        status: 'ACTIVE',
        description: '10-ton hydraulic floor jack',
        created_by: 'system'
      },
      { 
        item_code: 'ITM-00015',
        item_name: 'Air Compressor',
        category_id: cat2!.id,
        unit_id: unit4!.id, // Unit
        status: 'ACTIVE',
        description: 'Industrial air compressor 150PSI',
        created_by: 'system'
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${items.count} items`);

  // Seed Suppliers
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        supplier_code: 'SUP-00001',
        supplier_name: 'ABC Auto Parts Corporation',
        contact_number: '+63-2-1234-5678',
        email: 'sales@abcauto.com',
        street: '123 Industrial Avenue',
        barangay: 'Bagong Ilog',
        city: 'Pasig City',
        province: 'Metro Manila',
        status: 'ACTIVE',
        description: 'Leading supplier of bus parts and components',
        created_by: 'system'
      },
      {
        supplier_code: 'SUP-00002',
        supplier_name: 'XYZ Oils & Lubricants Inc.',
        contact_number: '+63-2-8765-4321',
        email: 'orders@xyzoils.ph',
        street: '456 Commerce Street',
        barangay: 'San Antonio',
        city: 'Makati City',
        province: 'Metro Manila',
        status: 'ACTIVE',
        description: 'Premium automotive oils and fluids distributor',
        created_by: 'system'
      },
      {
        supplier_code: 'SUP-00003',
        supplier_name: 'MegaTool Supply Center',
        contact_number: '+63-2-5555-1234',
        email: 'info@megatool.com',
        street: '789 Hardware Road',
        barangay: 'Ugong',
        city: 'Valenzuela City',
        province: 'Metro Manila',
        status: 'ACTIVE',
        description: 'Industrial tools and equipment supplier',
        created_by: 'system'
      },
      {
        supplier_code: 'SUP-00004',
        supplier_name: 'Premier Tire & Battery Co.',
        contact_number: '+63-2-9876-5432',
        email: 'sales@premiertire.ph',
        street: '321 Automotive Boulevard',
        barangay: 'Karuhatan',
        city: 'Valenzuela City',
        province: 'Metro Manila',
        status: 'ACTIVE',
        description: 'Bus tires and batteries specialist',
        created_by: 'system'
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${suppliers.count} suppliers`);

  // Fetch suppliers and items for supplier_item relationships
  const [supplier1, supplier2, supplier3, supplier4] = await Promise.all([
    prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00001' } }),
    prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00002' } }),
    prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00003' } }),
    prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00004' } }),
  ]);

  const itemsList = await Promise.all([
    prisma.item.findUnique({ where: { item_code: 'ITM-00001' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00002' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00003' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00004' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00005' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00006' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00007' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00008' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00009' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00010' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00011' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00012' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00013' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00014' } }),
    prisma.item.findUnique({ where: { item_code: 'ITM-00015' } }),
  ]);

  // Seed Supplier Items (linking suppliers to items with pricing)
  const supplierItems = await prisma.supplier_item.createMany({
    data: [
      // Supplier 1 (ABC Auto Parts) - Equipment & Parts
      {
        supplier_id: supplier1!.id,
        item_id: itemsList[4]!.id, // Air Filter
        supplier_unit_id: unit2!.id, // Box (they sell in boxes of 10)
        conversion_amount: 10, // 1 box = 10 pieces
        unit_price: 4500.00,
        description: 'Sold in boxes of 10 pieces',
        created_by: 'system'
      },
      {
        supplier_id: supplier1!.id,
        item_id: itemsList[5]!.id, // Oil Filter
        supplier_unit_id: unit2!.id, // Box
        conversion_amount: 12, // 1 box = 12 pieces
        unit_price: 3600.00,
        description: 'Sold in boxes of 12 pieces',
        created_by: 'system'
      },
      {
        supplier_id: supplier1!.id,
        item_id: itemsList[6]!.id, // Brake Pads Set
        supplier_unit_id: unit3!.id, // Set
        conversion_amount: 1, // 1 set = 1 set
        unit_price: 2800.00,
        description: 'Complete brake pad set for front and rear',
        created_by: 'system'
      },
      {
        supplier_id: supplier1!.id,
        item_id: itemsList[7]!.id, // Wiper Blades
        supplier_unit_id: unit1!.id, // Pieces
        conversion_amount: 1, // 1 piece = 1 piece
        unit_price: 350.00,
        description: 'Heavy-duty wiper blades',
        created_by: 'system'
      },

      // Supplier 2 (XYZ Oils) - Consumable Fluids
      {
        supplier_id: supplier2!.id,
        item_id: itemsList[0]!.id, // Engine Oil
        supplier_unit_id: unit6!.id, // Liter
        conversion_amount: 1, // 1 liter = 1 liter
        unit_price: 450.00,
        description: 'Synthetic 5W-30 engine oil',
        created_by: 'system'
      },
      {
        supplier_id: supplier2!.id,
        item_id: itemsList[1]!.id, // Brake Fluid
        supplier_unit_id: unit6!.id, // Liter
        conversion_amount: 1, // 1 liter = 1 liter
        unit_price: 280.00,
        description: 'DOT 4 brake fluid',
        created_by: 'system'
      },
      {
        supplier_id: supplier2!.id,
        item_id: itemsList[2]!.id, // Coolant
        supplier_unit_id: unit6!.id, // Liter
        conversion_amount: 1, // 1 liter = 1 liter
        unit_price: 320.00,
        description: 'Premium coolant/antifreeze',
        created_by: 'system'
      },
      {
        supplier_id: supplier2!.id,
        item_id: itemsList[3]!.id, // Transmission Oil
        supplier_unit_id: unit6!.id, // Liter
        conversion_amount: 1, // 1 liter = 1 liter
        unit_price: 380.00,
        description: 'ATF Dexron III transmission oil',
        created_by: 'system'
      },

      // Supplier 3 (MegaTool) - Tools & Machines
      {
        supplier_id: supplier3!.id,
        item_id: itemsList[10]!.id, // Torque Wrench Set
        supplier_unit_id: unit3!.id, // Set
        conversion_amount: 1, // 1 set = 1 set
        unit_price: 8500.00,
        description: 'Professional grade torque wrench set',
        created_by: 'system'
      },
      {
        supplier_id: supplier3!.id,
        item_id: itemsList[11]!.id, // Socket Set
        supplier_unit_id: unit3!.id, // Set
        conversion_amount: 1, // 1 set = 1 set
        unit_price: 5200.00,
        description: 'Complete socket wrench set with case',
        created_by: 'system'
      },
      {
        supplier_id: supplier3!.id,
        item_id: itemsList[12]!.id, // Screwdriver Set
        supplier_unit_id: unit3!.id, // Set
        conversion_amount: 1, // 1 set = 1 set
        unit_price: 1800.00,
        description: 'Professional screwdriver set',
        created_by: 'system'
      },
      {
        supplier_id: supplier3!.id,
        item_id: itemsList[13]!.id, // Hydraulic Jack
        supplier_unit_id: unit4!.id, // Unit
        conversion_amount: 1, // 1 unit = 1 unit
        unit_price: 12500.00,
        description: '10-ton capacity hydraulic floor jack',
        created_by: 'system'
      },
      {
        supplier_id: supplier3!.id,
        item_id: itemsList[14]!.id, // Air Compressor
        supplier_unit_id: unit4!.id, // Unit
        conversion_amount: 1, // 1 unit = 1 unit
        unit_price: 28000.00,
        description: 'Industrial 150PSI air compressor',
        created_by: 'system'
      },

      // Supplier 4 (Premier Tire & Battery) - Tires & Batteries
      {
        supplier_id: supplier4!.id,
        item_id: itemsList[8]!.id, // Battery
        supplier_unit_id: unit4!.id, // Unit
        conversion_amount: 1, // 1 unit = 1 unit
        unit_price: 8500.00,
        description: 'Heavy-duty 12V 200Ah bus battery with 1-year warranty',
        created_by: 'system'
      },
      {
        supplier_id: supplier4!.id,
        item_id: itemsList[9]!.id, // Tire
        supplier_unit_id: unit1!.id, // Pieces
        conversion_amount: 1, // 1 piece = 1 piece
        unit_price: 15500.00,
        description: 'Premium bus tire 11R22.5 with 2-year warranty',
        created_by: 'system'
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${supplierItems.count} supplier items`);

  console.log('✅ Core data seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });