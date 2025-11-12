/**
 * Master Seed Script
 * Runs all seed scripts in sequence
 */

import { execSync } from 'child_process';

console.log('🌱 Starting database seeding...\n');

try {
  // Seed enums
  console.log('📦 Step 1: Seeding enums...');
  execSync('npx tsx prisma/seed_enums.ts', { stdio: 'inherit' });
  
  // Seed core data
  console.log('\n📦 Step 2: Seeding core data...');
  execSync('npx tsx prisma/seed_core_data.ts', { stdio: 'inherit' });
  
  console.log('\n✅ All seeding completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Seeding failed:', error);
  process.exit(1);
}
