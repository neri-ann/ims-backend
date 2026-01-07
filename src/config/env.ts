
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  // Server
  port: number;
  nodeEnv: string;
  baseUrl: string;
  
  // Database
  databaseUrl: string;
  
  // Redis
  redisUrl: string;
  enableCache: boolean;
  
  // JWT Authentication
  enableJwtAuth: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // API Keys (for microservice-to-microservice auth)
  financeApiKey: string;
  hrApiKey: string;
  auditLogsApiKey: string;
  
  // External APIs
  externalApis: {
    inventory: string;
    finance: string;
    hr: string;
    auditLogs: string;
  };
  
  // Security
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMax: number;
  
  // Logging
  logLevel: string;
  logFile: string;
  
  // AI Chatbot
  geminiApiKey: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  
  databaseUrl: process.env.INVENTORY_MAIN_DATABASE_URL || process.env.INVENTORY_DATABASE_URL!,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  enableCache: process.env.ENABLE_CACHE === 'true',
  
  // JWT Configuration with toggle
  enableJwtAuth: process.env.ENABLE_JWT_AUTH === 'true',
  jwtSecret: process.env.JWT_SECRET || '8f7b3a2c9d4e6f8a0b1c2d3e4f5g6h7i',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  
  financeApiKey: process.env.FINANCE_SERVICE_API_KEY || 'FINANCE_DEFAULT_KEY',
  hrApiKey: process.env.HR_SERVICE_API_KEY || 'HR_DEFAULT_KEY',
  auditLogsApiKey: process.env.AUDIT_SERVICE_API_KEY || 'AUDIT_DEFAULT_KEY',
  
  externalApis: {
    inventory: process.env.INVENTORY_API_URL || 'http://localhost:5000',
    finance: process.env.FINANCE_API_URL || 'http://localhost:4000',
    hr: process.env.HR_API_URL || 'http://localhost:3002',
    auditLogs: process.env.AUDIT_API_URL || 'http://localhost:4004',
  },
  
  corsOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:4000').split(','),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || './logs/inventory.log',
  
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// JWT Configuration Warning
if (config.enableJwtAuth) {
  console.log('🔐 JWT Authentication: ENABLED');
  if (config.jwtSecret === '8f7b3a2c9d4e6f8a0b1c2d3e4f5g6h7i' && config.nodeEnv === 'production') {
    console.warn('⚠️  WARNING: Using default JWT secret in production! Please change JWT_SECRET in .env');
  }
} else {
  console.log('⚠️  JWT Authentication: DISABLED (Development mode only!)');
}

console.log('✅ Environment configuration loaded successfully');
