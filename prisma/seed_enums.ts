/**
 * Seed Enum Reference Tables
 * Create lookup tables for enum values (if needed for frontend dropdowns)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding enum reference data...');
  
  // Note: Prisma enums are already type-safe in the schema
  // This file is kept for consistency with the template structure
  // You can add global reference tables here if needed
  
  console.log('✅ Enum seeding completed (using Prisma native enums)!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding enums:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
