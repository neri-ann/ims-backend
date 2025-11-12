// Global type declarations for Node.js environment

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      INVENTORY_DATABASE_URL: string;
      REDIS_URL?: string;
      ENABLE_CACHE?: string;
      ENABLE_JWT_AUTH?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
      FINANCE_SERVICE_API_KEY?: string;
      HR_SERVICE_API_KEY?: string;
      AUDIT_SERVICE_API_KEY?: string;
      FINANCE_API_URL?: string;
      HR_API_URL?: string;
      AUDIT_API_URL?: string;
      ALLOWED_ORIGINS?: string;
      RATE_LIMIT_WINDOW_MS?: string;
      RATE_LIMIT_MAX?: string;
      LOG_LEVEL?: string;
      LOG_FILE?: string;
    }
  }
}

export {};
