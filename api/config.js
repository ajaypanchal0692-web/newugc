export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    provider: 'seedance',
    configured: Boolean(process.env.SEEDANCE_API_KEY || process.env.ARK_API_KEY) && Boolean(process.env.SEEDANCE_MODEL),
    storage: Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN) ? 'durable' : 'memory-fallback',
  });
}
