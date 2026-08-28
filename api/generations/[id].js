import jobs from '../_generation-store.js';
import { SeedanceProvider } from '../../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../../src/providers/seedance-http.js';

const store = { async save(job) { jobs.set(job.id, job); return job; }, async get(id) { return jobs.get(id) || null; } };

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  const id = request.query?.id;
  const job = await store.get(id);
  if (!job) return response.status(404).json({ error: 'generation job not found' });
  if (job.status === 'completed' || job.status === 'failed') return response.status(200).json(job);
  if (!job.providerJobId) return response.status(200).json(job);
  try {
    const remote = await new SeedanceProvider({ transport: new SeedanceHttpTransport() }).getGenerationStatus(job.providerJobId);
    const updated = { ...job, status: remote.status, outputUrl: remote.outputUrl || job.outputUrl, error: remote.error || job.error, updatedAt: new Date().toISOString() };
    await store.save(updated);
    return response.status(200).json(updated);
  } catch (error) { return response.status(502).json({ error: error instanceof Error ? error.message : String(error) }); }
}
