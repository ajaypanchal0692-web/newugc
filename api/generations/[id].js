import { createStatusHandler } from '../../server/status-route.js';
import { MemoryGenerationStore } from '../../server/store.js';
import { SeedanceProvider } from '../../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../../src/providers/seedance-http.js';
import { GenerationService } from '../../src/generation/service.js';

const store = new MemoryGenerationStore();
const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
const service = new GenerationService({ provider, store });
const handle = createStatusHandler({ store, service });

export default async function handler(request, response) {
  const id = request.query?.id;
  const result = await handle({ method: request.method }, id);
  response.status(result.status).json(result.body);
}
