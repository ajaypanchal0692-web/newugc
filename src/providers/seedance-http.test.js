import assert from 'node:assert/strict';
import test from 'node:test';
import { SeedanceHttpTransport } from './seedance-http.js';

test('creates an Ark Seedance task with structured content', async () => {
  let captured;
  const transport = new SeedanceHttpTransport({
    baseUrl: 'https://ark.example/api/v3',
    apiKey: 'test-key',
    model: 'seedance-test',
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return new Response(JSON.stringify({ id: 'task-123' }), { status: 200 });
    },
  });

  const result = await transport.create({
    prompt: 'Create a natural UGC product video',
    durationSeconds: 15,
    aspectRatio: '9:16',
    referenceImages: ['https://cdn.example/product.jpg'],
  });

  assert.equal(result.id, 'task-123');
  assert.equal(captured.url, 'https://ark.example/api/v3/contents/generations/tasks');
  const body = JSON.parse(captured.options.body);
  assert.equal(body.model, 'seedance-test');
  assert.equal(body.ratio, '9:16');
  assert.equal(body.duration, 15);
  assert.equal(body.content[0].type, 'text');
  assert.equal(body.content[1].type, 'image_url');
});

test('maps Ark task status to application status', async () => {
  const transport = new SeedanceHttpTransport({
    baseUrl: 'https://ark.example/api/v3',
    apiKey: 'test-key',
    model: 'seedance-test',
    fetchImpl: async () => new Response(JSON.stringify({
      status: 'succeeded',
      content: { video_url: 'https://cdn.example/video.mp4' },
    }), { status: 200 }),
  });

  const result = await transport.status('task-123');
  assert.equal(result.status, 'completed');
  assert.equal(result.outputUrl, 'https://cdn.example/video.mp4');
});
