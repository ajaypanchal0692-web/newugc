const memory = new Map();

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function redisCommand(command) {
  const config = redisConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/${command.map((part) => encodeURIComponent(String(part))).join('/')}`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error || `Redis request failed (${response.status})`);
  return payload.result;
}

export function createGenerationStore() {
  return {
    async save(job) {
      memory.set(job.id, job);
      if (redisConfig()) await redisCommand(['set', `newugc:generation:${job.id}`, JSON.stringify(job)]);
      return job;
    },
    async get(id) {
      if (!id) return null;
      const cached = memory.get(id);
      if (cached) return cached;
      const result = await redisCommand(['get', `newugc:generation:${id}`]);
      if (!result) return null;
      const job = JSON.parse(result);
      memory.set(id, job);
      return job;
    },
    async status() {
      return redisConfig() ? 'durable' : 'memory';
    },
  };
}
