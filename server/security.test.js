import assert from 'node:assert/strict';
import test from 'node:test';
import { rateLimit, SECURITY_LIMITS } from './security.js';

test('rate limiter allows normal traffic and blocks excess requests', () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  for (let i = 0; i < SECURITY_LIMITS.MAX_REQUESTS; i++) assert.equal(rateLimit(key).allowed, true);
  const blocked = rateLimit(key);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});
