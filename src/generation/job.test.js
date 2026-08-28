import assert from 'node:assert/strict';
import test from 'node:test';
import { createGenerationJob, updateGenerationJob, JOB_STATES } from './job.js';

test('creates queued generation job', () => {
  const job = createGenerationJob({ projectId: 'project-1', prompt: '  hello  ' });
  assert.equal(job.projectId, 'project-1');
  assert.equal(job.prompt, 'hello');
  assert.equal(job.status, JOB_STATES.QUEUED);
});

test('updates generation job status', () => {
  const job = createGenerationJob({ projectId: 'project-1', prompt: 'hello' });
  const updated = updateGenerationJob(job, { status: JOB_STATES.COMPLETED, outputUrl: 'https://example.test/video.mp4' });
  assert.equal(updated.status, JOB_STATES.COMPLETED);
  assert.equal(updated.outputUrl, 'https://example.test/video.mp4');
});
