import { GenerationService } from '../src/generation/service.js';
import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';

export function createGenerationHandler({ store, service } = {}) {
  const generationService = service || new GenerationService({
    provider: new SeedanceProvider({ transport: new SeedanceHttpTransport() }),
    store,
  });

  return async function handle(request) {
    if (request.method !== 'POST') return { status: 405, body: { error: 'Method not allowed' } };
    const body = request.body ?? {};
    if (!body.projectId || !body.prompt) {
      return { status: 400, body: { error: 'projectId and prompt are required' } };
    }

    const job = await generationService.submit({
      projectId: body.projectId,
      prompt: body.prompt,
      durationSeconds: body.durationSeconds,
      aspectRatio: body.aspectRatio,
      referenceImage: body.referenceImage,
    });

    return { status: job.status === 'failed' ? 502 : 202, body: job };
  };
}
