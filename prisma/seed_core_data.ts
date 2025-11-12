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
      { categoryCode: 'CAT-001', categoryName: 'Electronics', description: 'Electronic items and components', createdBy: 'system' },
      { categoryCode: 'CAT-002', categoryName: 'Office Supplies', description: 'General office supplies', createdBy: 'system' },
      { categoryCode: 'CAT-003', categoryName: 'Vehicle Parts', description: 'Bus and vehicle spare parts', createdBy: 'system' },
      { categoryCode: 'CAT-004', categoryName: 'Maintenance', description: 'Maintenance and cleaning supplies', createdBy: 'system' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${categories.count} categories`);

  // Seed Unit Measures
  const units = await prisma.unitMeasure.createMany({
    data: [
      { unitCode: 'PCS', unitName: 'Pieces', abbreviation: 'pcs', createdBy: 'system' },
      { unitCode: 'BOX', unitName: 'Box', abbreviation: 'box', createdBy: 'system' },
      { unitCode: 'SET', unitName: 'Set', abbreviation: 'set', createdBy: 'system' },
      { unitCode: 'UNIT', unitName: 'Unit', abbreviation: 'unit', createdBy: 'system' },
      { unitCode: 'KG', unitName: 'Kilogram', abbreviation: 'kg', createdBy: 'system' },
      { unitCode: 'LTR', unitName: 'Liter', abbreviation: 'L', createdBy: 'system' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${units.count} unit measures`);

  // Seed Body Builders
  const bodyBuilders = await prisma.bodyBuilder.createMany({
    data: [
      { bodyBuilderCode: 'BB-001', bodyBuilderName: 'Almazora Motors', createdBy: 'system' },
      { bodyBuilderCode: 'BB-002', bodyBuilderName: 'Centro Manufacturing', createdBy: 'system' },
      { bodyBuilderCode: 'BB-003', bodyBuilderName: 'Del Monte Motor Works', createdBy: 'system' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${bodyBuilders.count} body builders`);

  // Seed Manufacturers
  const manufacturers = await prisma.manufacturer.createMany({
    data: [
      { manufacturerCode: 'MFG-001', manufacturerName: 'Hino Motors', createdBy: 'system' },
      { manufacturerCode: 'MFG-002', manufacturerName: 'Isuzu Philippines', createdBy: 'system' },
      { manufacturerCode: 'MFG-003', manufacturerName: 'Mitsubishi Fuso', createdBy: 'system' },
      { manufacturerCode: 'MFG-004', manufacturerName: 'Hyundai Motors', createdBy: 'system' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${manufacturers.count} manufacturers`);

  // Seed Dealers
  const dealers = await prisma.dealer.createMany({
    data: [
      { 
        dealerCode: 'DLR-001', 
        dealerName: 'Metro Manila Bus Center', 
        contactNumber: '(02) 8123-4567',
        email: 'sales@mmbc.com',
        address: 'Quezon City, Metro Manila',
        createdBy: 'system' 
      },
      { 
        dealerCode: 'DLR-002', 
        dealerName: 'Cebu Commercial Vehicles', 
        contactNumber: '(032) 234-5678',
        email: 'info@cebucommercial.com',
        address: 'Cebu City, Cebu',
        createdBy: 'system' 
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Created ${dealers.count} dealers`);

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
