import http from 'node:http';
import { createGenerationHandler } from './generation-route.js';
import { createStatusHandler } from './status-route.js';
import { MemoryGenerationStore } from './store.js';
import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';
import { GenerationService } from '../src/generation/service.js';

const store = new MemoryGenerationStore();
const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
const service = new GenerationService({ provider, store });
const postGeneration = createGenerationHandler({ store });
const getStatus = createStatusHandler({ store, service });

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return {};
  try { return JSON.parse(text); } catch { throw Object.assign(new Error('Invalid JSON body'), { statusCode: 400 }); }
}

function send(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'POST' && request.url === '/api/generations') {
      const result = await postGeneration({ method: request.method, body: await readJson(request) });
      return send(response, result.status, result.body);
    }

    const match = request.url?.match(/^\/api\/generations\/([^/?]+)$/);
    if (request.method === 'GET' && match) {
      const result = await getStatus({ method: request.method }, decodeURIComponent(match[1]));
      return send(response, result.status, result.body);
    }

    send(response, 404, { error: 'Not found' });
  } catch (error) {
    send(response, error.statusCode || 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`newugc server listening on http://localhost:${port}`));
