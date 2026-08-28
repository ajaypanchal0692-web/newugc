import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';

/**
 * Framework-neutral status handler. Inject a store implementing get(jobId)
 * and save(job), then mount this behind GET /api/generations/:id.
 */
export function createGenerationStatusHandler({ store }) {
  const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });

  return async function handle(request, jobId) {
    if (request.method !== 'GET') return { status: 405, body: { error: 'Method not allowed' } };
    if (!jobId) return { status: 400, body: { error: 'generation id is required' } };

    const job = await store.get(jobId);
    if (!job) return { status: 404, body: { error: 'generation not found' } };

    if (['completed', 'failed'].includes(job.status)) {
      return { status: 200, body: job };
    }

    try {
      const remote = await provider.getGenerationStatus(job.providerJobId);
      const updated = {
        ...job,
        status: remote.status,
        outputUrl: remote.outputUrl ?? job.outputUrl,
        error: remote.error ?? job.error,
        updatedAt: new Date().toISOString(),
      };
      await store.save(updated);
      return { status: 200, body: updated };
    } catch (error) {
      return { status: 502, body: { error: error instanceof Error ? error.message : String(error) } };
    }
  };
}
