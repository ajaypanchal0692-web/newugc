import { JOB_STATES } from '../src/generation/job.js';

export function createStatusHandler({ store, service }) {
  return async function handle(request, id) {
    if (request.method !== 'GET') return { status: 405, body: { error: 'Method not allowed' } };
    if (!id) return { status: 400, body: { error: 'generation id is required' } };

    const job = await store.get(id);
    if (!job) return { status: 404, body: { error: 'generation job not found' } };

    if ([JOB_STATES.QUEUED, JOB_STATES.PROCESSING].includes(job.status)) {
      try {
        const refreshed = await service.refresh(job);
        return { status: 200, body: refreshed };
      } catch (error) {
        return { status: 502, body: { error: error instanceof Error ? error.message : String(error) } };
      }
    }

    return { status: 200, body: job };
  };
}
