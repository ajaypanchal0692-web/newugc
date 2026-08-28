import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';
import { GenerationService } from '../src/generation/service.js';

export function createGenerationHandler({ store }) {
  const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
  const service = new GenerationService({ provider, store });

  return async function handle(request) {
    if (request.method !== 'POST') return { status: 405, body: { error: 'Method not allowed' } };

    const body = request.body ?? {};
    if (!body.projectId || !body.prompt) {
      return { status: 400, body: { error: 'projectId and prompt are required' } };
    }

    const job = await service.submit({
      projectId: body.projectId,
      prompt: body.prompt,
      durationSeconds: body.durationSeconds,
      aspectRatio: body.aspectRatio,
      referenceImage: body.referenceImage,
      referenceImages: body.referenceImages,
      resolution: body.resolution,
      generateAudio: body.generateAudio,
      watermark: body.watermark,
    });

    return { status: job.status === 'failed' ? 502 : 202, body: job };
  };
}
