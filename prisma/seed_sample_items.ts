/**
 * Seed Sample Items
 * Add sample inventory items for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample items...\n');

  // Get category and unit IDs
  const electronicsCategory = await prisma.category.findFirst({ where: { categoryCode: 'CAT-001' } });
  const officeCategory = await prisma.category.findFirst({ where: { categoryCode: 'CAT-002' } });
  const vehicleCategory = await prisma.category.findFirst({ where: { categoryCode: 'CAT-003' } });
  
  const pcsUnit = await prisma.unitMeasure.findFirst({ where: { unitCode: 'PCS' } });
  const boxUnit = await prisma.unitMeasure.findFirst({ where: { unitCode: 'BOX' } });
  const setUnit = await prisma.unitMeasure.findFirst({ where: { unitCode: 'SET' } });

  if (!electronicsCategory || !pcsUnit) {
    console.error('❌ Required categories or units not found. Run seed_core_data.ts first.');
    process.exit(1);
  }

  // Seed Items
  const items = await prisma.item.createMany({
    data: [
      {
        itemCode: 'ITM-001',
        itemName: 'Laptop Computer',
        categoryId: electronicsCategory.id,
        unitId: pcsUnit.id,
        status: 'ACTIVE',
        description: 'Dell Latitude 5420 - 14 inch, Intel i5, 8GB RAM',
        createdBy: 'system'
      },
      {
        itemCode: 'ITM-002',
        itemName: 'Wireless Mouse',
        categoryId: electronicsCategory.id,
        unitId: pcsUnit.id,
        status: 'ACTIVE',
        description: 'Logitech M185 Wireless Mouse',
        createdBy: 'system'
      },
      {
        itemCode: 'ITM-003',
        itemName: 'Office Paper A4',
        categoryId: officeCategory!.id,
        unitId: boxUnit!.id,
        status: 'ACTIVE',
        description: 'A4 Size Copy Paper - 500 sheets per box',
        createdBy: 'system'
      },
      {
        itemCode: 'ITM-004',
        itemName: 'Ballpen Blue',
        categoryId: officeCategory!.id,
        unitId: boxUnit!.id,
        status: 'ACTIVE',
        description: 'Blue ballpoint pen - 50 pcs per box',
        createdBy: 'system'
      },
      {
        itemCode: 'ITM-005',
        itemName: 'Bus Tire Set',
        categoryId: vehicleCategory!.id,
        unitId: setUnit!.id,
        status: 'ACTIVE',
        description: 'Complete tire set for bus - 6 tires',
        createdBy: 'system'
      },
      {
        itemCode: 'ITM-006',
        itemName: 'Air Filter',
        categoryId: vehicleCategory!.id,
        unitId: pcsUnit.id,
        status: 'ACTIVE',
        description: 'Engine air filter for bus',
        createdBy: 'system'
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${items.count} sample items`);
  console.log('');

  // Display created items
  const allItems = await prisma.item.findMany({
    include: {
      category: true,
      unit: true,
    },
  });

  console.log('📦 Items in database:');
  allItems.forEach((item) => {
    console.log(`   ${item.itemCode} - ${item.itemName} (${item.category.categoryName}, ${item.unit.abbreviation})`);
  });

  console.log('\n✅ Sample items seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding items:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
