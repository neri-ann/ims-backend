import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

// Create Redis client only if caching is enabled
let redis: Redis | null = null;

if (config.enableCache) {
  redis = new Redis(config.redisUrl, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  // Redis event handlers
  redis.on('connect', () => {
    logger.info('✅ Redis connected');
  });

  redis.on('error', (error) => {
    logger.error('❌ Redis connection error:', error);
  });

  redis.on('close', () => {
    logger.warn('⚠️  Redis connection closed');
  });
} else {
  logger.info('ℹ️  Redis cache is disabled (ENABLE_CACHE=false)');
}

// Export redis (can be null if disabled)
export { redis };

// Cache helper functions
export const cache = {
  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    if (!config.enableCache || !redis) return null;
    
    try {
      return await redis.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache with optional TTL (seconds)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!config.enableCache || !redis) return;
    
    try {
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    if (!config.enableCache || !redis) return;
    
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    if (!config.enableCache || !redis) return;
    
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
    }
  },
};
