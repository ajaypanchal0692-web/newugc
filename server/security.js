const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const buckets = new Map();

export function rateLimit(key = 'anonymous') {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  current.count += 1;
  if (current.count > MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export const SECURITY_LIMITS = Object.freeze({ WINDOW_MS, MAX_REQUESTS, MAX_BODY_BYTES: 1_000_000 });
