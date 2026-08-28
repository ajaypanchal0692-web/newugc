import http from 'node:http';
import { createGenerationHandler } from './generation-route.js';
import { createStatusHandler } from './status-route.js';
import { healthHandler } from './health-route.js';
import { MemoryGenerationStore } from './store.js';
import { SeedanceProvider } from '../src/providers/seedance.js';
import { SeedanceHttpTransport } from '../src/providers/seedance-http.js';
import { GenerationService } from '../src/generation/service.js';
import { rateLimit, SECURITY_LIMITS } from './security.js';

const store = new MemoryGenerationStore();
const provider = new SeedanceProvider({ transport: new SeedanceHttpTransport() });
const service = new GenerationService({ provider, store });
const postGeneration = createGenerationHandler({ store });
const getStatus = createStatusHandler({ store, service });

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > SECURITY_LIMITS.MAX_BODY_BYTES) throw Object.assign(new Error('Request body too large'), { statusCode: 413 });
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return {};
  try { return JSON.parse(text); } catch { throw Object.assign(new Error('Invalid JSON body'), { statusCode: 400 }); }
}

function send(response, status, body, headers = {}) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  response.end(JSON.stringify(body));
}

function clientKey(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return String(forwarded || request.socket.remoteAddress || 'anonymous').split(',')[0].trim();
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/health') {
      const result = healthHandler(request);
      return send(response, result.status, result.body);
    }
    if (request.method === 'POST' && request.url === '/api/generations') {
      const limit = rateLimit(clientKey(request));
      if (!limit.allowed) return send(response, 429, { error: 'Rate limit exceeded' }, { 'retry-after': String(limit.retryAfterSeconds) });
      const result = await postGeneration({ method: request.method, body: await readJson(request) });
      return send(response, result.status, result.body);
    }
    const match = request.url?.match(/^\/api\/generations\/([^/?]+)$/);
    if (request.method === 'GET' && match) {
      const result = await getStatus({ method: request.method }, decodeURIComponent(match[1]));
      return send(response, result.status, result.body);
    }
    return send(response, 404, { error: 'Not found' });
  } catch (error) {
    return send(response, error.statusCode || 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`newugc server listening on http://localhost:${port}`));
