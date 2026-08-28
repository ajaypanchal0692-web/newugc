import { GenerationService } from '../../src/generation/service.js';
import { SeedanceProvider } from '../../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../../src/providers/seedance-http.js';
import { createGenerationStore } from '../../src/storage/generation-store.js';

const store = createGenerationStore();

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  try {
    const body = request.body || {};
    if (!body.projectId || !body.prompt) return response.status(400).json({ error: 'projectId and prompt are required' });
    const service = new GenerationService({ provider: new SeedanceProvider({ transport: new SeedanceHttpTransport() }), store });
    const job = await service.submit({
      projectId: body.projectId,
      prompt: body.prompt,
      durationSeconds: body.durationSeconds,
      aspectRatio: body.aspectRatio,
      referenceImage: body.referenceImage,
    });
    return response.status(job.status === 'failed' ? 502 : 202).json({ ...job, storage: await store.status() });
  } catch (error) {
    return response.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
