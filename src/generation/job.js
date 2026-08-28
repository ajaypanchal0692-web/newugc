export const JOB_STATES = Object.freeze({
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

export function createGenerationJob({ projectId, prompt, provider = 'seedance' }) {
  if (!projectId) throw new Error('projectId is required');
  if (!prompt?.trim()) throw new Error('prompt is required');

  return {
    id: crypto.randomUUID(),
    projectId,
    provider,
    status: JOB_STATES.QUEUED,
    prompt: prompt.trim(),
    providerJobId: null,
    outputUrl: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function updateGenerationJob(job, patch = {}) {
  if (!Object.values(JOB_STATES).includes(patch.status ?? job.status)) {
    throw new Error('invalid generation job status');
  }

  return {
    ...job,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}
