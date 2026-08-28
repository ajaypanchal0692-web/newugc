import assert from 'node:assert/strict';
import test from 'node:test';
import { SeedanceProvider } from './seedance.js';

test('Seedance adapter forwards generation requests to injected transport', async () => {
  const calls = [];
  const provider = new SeedanceProvider({
    transport: {
      async create(request) { calls.push(request); return { id: 'job-1' }; },
      async status(id) { return { status: 'completed', outputUrl: `https://example.test/${id}.mp4` }; },
    },
  });

  const result = await provider.createGeneration({
    prompt: 'UGC prompt', durationSeconds: 15, aspectRatio: '9:16', referenceImage: 'image-1'
  });

  assert.equal(result.id, 'job-1');
  assert.deepEqual(calls[0], {
    prompt: 'UGC prompt', durationSeconds: 15, aspectRatio: '9:16', referenceImage: 'image-1'
  });
  assert.equal((await provider.getGenerationStatus('job-1')).status, 'completed');
});
