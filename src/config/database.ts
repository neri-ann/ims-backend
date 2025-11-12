import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Create Prisma Client instance
export const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log Prisma warnings
prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e);
});

// Log Prisma errors
prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

// Test connection on module load
prisma.$connect()
  .then(() => {
    logger.info('✅ Database connection established');
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
  });
