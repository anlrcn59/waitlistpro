type Entry = { count: number; resetAt: number };

// In-memory store — resets on cold start.
// For multi-instance deployments, replace with Redis (Upstash).
const store = new Map<string, Entry>();

export type RateLimitResult =
  | { success: true }
  | { success: false; retryAfter: number };

/**
 * Simple sliding-window rate limiter.
 * @param key      Unique identifier (e.g. `ip:waitlist_id`)
 * @param limit    Max requests allowed per window
 * @param windowMs Window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { success: true };
}

/** Extract the best available client IP from request headers. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
