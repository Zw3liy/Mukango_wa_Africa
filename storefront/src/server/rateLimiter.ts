interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60_000, maxRequests: number = 20) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public check(identifier: string): { allowed: boolean; remaining: number; retryAfterSec: number } {
    const now = Date.now();
    const record = this.store.get(identifier);

    // Clean up expired records periodically
    if (this.store.size > 5000) {
      for (const [key, value] of this.store.entries()) {
        if (value.resetTime <= now) {
          this.store.delete(key);
        }
      }
    }

    if (!record || record.resetTime <= now) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        retryAfterSec: 0,
      };
    }

    if (record.count >= this.maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec,
      };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      retryAfterSec: 0,
    };
  }

  public reset(): void {
    this.store.clear();
  }
}

export const globalRateLimiter = new InMemoryRateLimiter(60_000, 30);
export const formRateLimiter = new InMemoryRateLimiter(60_000, 5); // 5 submissions per minute per IP
