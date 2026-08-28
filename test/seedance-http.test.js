import test from 'node:test';
import assert from 'node:assert/strict';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';

test('Seedance transport creates a task with supported options', async () => {
  let request;
  const transport = new SeedanceHttpTransport({ apiKey: 'test-key', model: 'test-model', baseUrl: 'https://example.test', fetchImpl: async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ id: 'task-123' }), { status: 200, headers: { 'content-type': 'application/json' } });
  }});
  const result = await transport.create({ prompt: 'test prompt', durationSeconds: 15, aspectRatio: '9:16', generateAudio: true, resolution: '720p', watermark: false });
  assert.equal(result.id, 'task-123');
  assert.equal(request.url, 'https://example.test/contents/generations/tasks');
  const body = JSON.parse(request.options.body);
  assert.equal(body.model, 'test-model');
  assert.equal(body.ratio, '9:16');
  assert.equal(body.duration, 15);
  assert.equal(body.generate_audio, true);
  assert.equal(body.resolution, '720p');
  assert.equal(body.watermark, false);
});
