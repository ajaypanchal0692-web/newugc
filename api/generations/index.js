import { createGenerationHandler } from '../../server/generation-route.js';
import { MemoryGenerationStore } from '../../server/store.js';
import { SeedanceProvider } from '../../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../../src/providers/seedance-http.js';
import { GenerationService } from '../../src/generation/service.js';

const store = new MemoryGenerationStore();
const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
const service = new GenerationService({ provider, store });
const handle = createGenerationHandler({ store, service });

export default async function handler(request, response) {
  const body = request.body || {};
  const result = await handle({ method: request.method, body });
  response.status(result.status).json(result.body);
}
