import test from 'node:test';
import assert from 'node:assert/strict';
import { createGenerationStore } from '../src/storage/generation-store.js';

test('generation store saves and reads a job', async () => {
  const store = createGenerationStore();
  const job = { id: 'test-job', status: 'queued', prompt: 'test' };
  await store.save(job);
  assert.deepEqual(await store.get(job.id), job);
});

test('generation store reports memory fallback without Redis configuration', async () => {
  const store = createGenerationStore();
  assert.equal(await store.status(), 'memory');
});
