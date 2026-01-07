/**
 * Seeder: suppliers + supplier_items
 * Uses exact Prisma models `supplier` and `supplier_item`.
 * supplier_item createMany is used with skipDuplicates to be idempotent.
 */
import { PrismaClient, supplier_status } from '@prisma/client';

export async function seedSuppliers(prisma: PrismaClient) {
  console.log('  - Seeding suppliers and supplier_items...');

  const suppliers = [
    { supplier_code: 'SUP-00001', supplier_name: 'ABC Auto Parts Corporation', contact_number: '+63-2-1234-5678', email: 'sales@abcauto.com', city: 'Pasig City', province: 'Metro Manila', status: supplier_status.ACTIVE, description: 'Leading supplier', created_by: 'seeder' },
    { supplier_code: 'SUP-00002', supplier_name: 'XYZ Oils & Lubricants Inc.', contact_number: '+63-2-8765-4321', email: 'orders@xyzoils.ph', city: 'Makati City', province: 'Metro Manila', status: supplier_status.ACTIVE, description: 'Oils distributor', created_by: 'seeder' },
    { supplier_code: 'SUP-00003', supplier_name: 'MegaTool Supply Center', contact_number: '+63-2-5555-1234', email: 'info@megatool.com', city: 'Valenzuela City', province: 'Metro Manila', status: supplier_status.ACTIVE, description: 'Tools and equipment', created_by: 'seeder' },
    { supplier_code: 'SUP-00004', supplier_name: 'Premier Tire & Battery Co.', contact_number: '+63-2-9876-5432', email: 'sales@premiertire.ph', city: 'Valenzuela City', province: 'Metro Manila', status: supplier_status.ACTIVE, description: 'Tires & batteries', created_by: 'seeder' },
  ];

  for (const s of suppliers) {
    await prisma.supplier.upsert({ where: { supplier_code: s.supplier_code }, update: { ...s, updated_by: 'seeder' }, create: s });
  }

  // Map supplier items using existing items and units
  const sup1 = await prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00001' } });
  const sup2 = await prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00002' } });
  const sup3 = await prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00003' } });
  const sup4 = await prisma.supplier.findUnique({ where: { supplier_code: 'SUP-00004' } });

  const items = await prisma.item.findMany({ where: { item_code: { in: ['ITM-00001','ITM-00002','ITM-00003','ITM-00004','ITM-00005','ITM-00006','ITM-00007','ITM-00008','ITM-00009','ITM-00010','ITM-00011','ITM-00012','ITM-00013','ITM-00014','ITM-00015'] } } });

  const unitBox = await prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00002' } });
  const unitPiece = await prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00001' } });
  const unitSet = await prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00003' } });
  const unitUnit = await prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00004' } });
  const unitLiter = await prisma.unit_measure.findUnique({ where: { unit_code: 'UNT-00006' } });

  const supplierItemsData: any[] = [];

  if (sup1) {
    // ABC Auto Parts
    supplierItemsData.push({ supplier_id: sup1.id, item_id: items.find(i=>i.item_code==='ITM-00005')!.id, supplier_unit_id: unitBox!.id, conversion_amount: '10.0000', unit_price: '4500.00', description: 'Box of 10', created_by: 'seeder' });
    supplierItemsData.push({ supplier_id: sup1.id, item_id: items.find(i=>i.item_code==='ITM-00006')!.id, supplier_unit_id: unitBox!.id, conversion_amount: '12.0000', unit_price: '3600.00', description: 'Box of 12', created_by: 'seeder' });
  }
  if (sup2) {
    supplierItemsData.push({ supplier_id: sup2.id, item_id: items.find(i=>i.item_code==='ITM-00001')!.id, supplier_unit_id: unitLiter!.id, conversion_amount: '1.0000', unit_price: '450.00', description: 'Per liter', created_by: 'seeder' });
    supplierItemsData.push({ supplier_id: sup2.id, item_id: items.find(i=>i.item_code==='ITM-00002')!.id, supplier_unit_id: unitLiter!.id, conversion_amount: '1.0000', unit_price: '280.00', description: 'Per liter', created_by: 'seeder' });
  }
  if (sup3) {
    supplierItemsData.push({ supplier_id: sup3.id, item_id: items.find(i=>i.item_code==='ITM-00011')!.id, supplier_unit_id: unitSet!.id, conversion_amount: '1.0000', unit_price: '8500.00', description: 'Set', created_by: 'seeder' });
    supplierItemsData.push({ supplier_id: sup3.id, item_id: items.find(i=>i.item_code==='ITM-00012')!.id, supplier_unit_id: unitSet!.id, conversion_amount: '1.0000', unit_price: '5200.00', description: 'Set', created_by: 'seeder' });
  }
  if (sup4) {
    supplierItemsData.push({ supplier_id: sup4.id, item_id: items.find(i=>i.item_code==='ITM-00009')!.id, supplier_unit_id: unitUnit!.id, conversion_amount: '1.0000', unit_price: '8500.00', description: 'Unit', created_by: 'seeder' });
    supplierItemsData.push({ supplier_id: sup4.id, item_id: items.find(i=>i.item_code==='ITM-00010')!.id, supplier_unit_id: unitPiece!.id, conversion_amount: '1.0000', unit_price: '15500.00', description: 'Piece', created_by: 'seeder' });
  }

  if (supplierItemsData.length > 0) {
    // use createMany with skipDuplicates to be idempotent
    await prisma.supplier_item.createMany({ data: supplierItemsData, skipDuplicates: true });
  }

  console.log('    ✅ suppliers and supplier_items seeded');
}
