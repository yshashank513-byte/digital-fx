import { NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for rate limiting with automatic pruning
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;
let lastPruned = Date.now();

function pruneStale(now: number) {
  if (now - lastPruned < PRUNE_INTERVAL_MS) return;
  lastPruned = now;

  for (const [key, record] of rateLimitMap.entries()) {
    // Keep only timestamps within last 1 hour
    const recent = record.timestamps.filter((ts) => now - ts < 3600 * 1000);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = recent;
    }
  }
}

/**
 * Extracts a reliable client IP address from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Return first IP in list (client original IP)
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

export interface RateLimitOptions {
  windowMs: number; // Duration of window in milliseconds
  max: number;      // Maximum requests allowed in windowMs
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and increments rate limit for a given key (e.g. `login:192.168.1.1`).
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  pruneStale(now);

  const windowStart = now - options.windowMs;
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.max) {
    const oldestInWindow = record.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldestInWindow + options.windowMs - now) / 1000));
    return {
      success: false,
      limit: options.max,
      remaining: 0,
      resetSeconds,
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = Math.max(0, options.max - record.timestamps.length);
  const resetSeconds = Math.ceil(options.windowMs / 1000);

  return {
    success: true,
    limit: options.max,
    remaining,
    resetSeconds,
  };
}

/**
 * Convenience helper to return a standard 429 response with security headers.
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `Too many requests. Please wait ${result.resetSeconds} seconds before trying again.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.resetSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
