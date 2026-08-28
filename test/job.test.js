import test from 'node:test';
import assert from 'node:assert/strict';
import { createGenerationJob, updateGenerationJob, JOB_STATES } from '../src/generation/job.js';

test('generation jobs validate input and transition state', () => {
  const job = createGenerationJob({ projectId: 'p1', prompt: '  hello  ' });
  assert.equal(job.prompt, 'hello');
  assert.equal(job.status, JOB_STATES.QUEUED);
  const updated = updateGenerationJob(job, { status: JOB_STATES.PROCESSING, providerJobId: 'remote-1' });
  assert.equal(updated.status, 'processing');
  assert.equal(updated.providerJobId, 'remote-1');
});
