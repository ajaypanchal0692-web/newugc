import assert from 'node:assert/strict';
import test from 'node:test';
import { createStatusHandler } from './status-route.js';
import { MemoryGenerationStore } from './store.js';

test('status handler returns 404 for unknown generation', async () => {
  const store = new MemoryGenerationStore();
  const handler = createStatusHandler({ store, service: {} });
  const result = await handler({ method: 'GET' }, 'missing');
  assert.equal(result.status, 404);
});

test('status handler returns completed stored job without provider refresh', async () => {
  const store = new MemoryGenerationStore();
  const job = {
    id: 'job-1', status: 'completed', providerJobId: 'remote-1',
    outputUrl: 'https://example.test/video.mp4'
  };
  await store.save(job);
  const handler = createStatusHandler({ store, service: { refresh: async () => { throw new Error('should not refresh'); } } });
  const result = await handler({ method: 'GET' }, 'job-1');
  assert.equal(result.status, 200);
  assert.equal(result.body.outputUrl, job.outputUrl);
});
