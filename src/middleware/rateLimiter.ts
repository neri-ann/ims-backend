import { Request, Response, NextFunction } from 'express';

interface RateEntry {
  tokens: number;
  last: number;
}

const clients = new Map<string, RateEntry>();

// Simple token-bucket rate limiter (in-memory). Safe for development and small deployments.
// Config: 100 requests per 60 seconds per IP by default.
const MAX_TOKENS = 100;
const REFILL_INTERVAL_MS = 60 * 1000; // 60s

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = (req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown') as string;
    const now = Date.now();
    const entry = clients.get(ip) || { tokens: MAX_TOKENS, last: now };

    const elapsed = now - entry.last;
    if (elapsed > 0) {
      const refill = Math.floor(elapsed / REFILL_INTERVAL_MS) * MAX_TOKENS;
      entry.tokens = Math.min(MAX_TOKENS, entry.tokens + refill);
      entry.last = now;
    }

    if (entry.tokens <= 0) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    entry.tokens -= 1;
    clients.set(ip, entry);
    next();
  } catch {
    // In case of unexpected error, allow the request to avoid accidental DoS
    next();
  }
}
