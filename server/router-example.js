import { createGenerationHandler } from './generation-route.js';
import { createStatusHandler } from './status-route.js';
import { MemoryGenerationStore } from './store.js';
import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';
import { GenerationService } from '../src/generation/service.js';

const store = new MemoryGenerationStore();
const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
const service = new GenerationService({ provider, store });

export const routes = {
  POST: { '/api/generations': createGenerationHandler({ store }) },
  GET: { '/api/generations/:id': createStatusHandler({ store, service }) },
};

// Adapt these handlers to the HTTP framework used by your deployment.
