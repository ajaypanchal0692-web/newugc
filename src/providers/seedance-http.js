/**
 * HTTP transport for the Seedance provider.
 *
 * The exact endpoint is configured at runtime with SEEDANCE_API_URL and the
 * secret is supplied by the server environment as SEEDANCE_API_KEY. Never
 * expose either value to browser code.
 */
export class SeedanceHttpTransport {
  constructor({ baseUrl = process.env.SEEDANCE_API_URL, apiKey = process.env.SEEDANCE_API_KEY, fetchImpl = fetch } = {}) {
    if (!baseUrl) throw new Error('SEEDANCE_API_URL is not configured');
    if (!apiKey) throw new Error('SEEDANCE_API_KEY is not configured');
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.fetch = fetchImpl;
  }

  async create(request) {
    return this.request('/generations', {
      method: 'POST',
      body: {
        prompt: request.prompt,
        duration: request.durationSeconds,
        aspect_ratio: request.aspectRatio,
        reference_image: request.referenceImage,
      },
    });
  }

  async status(providerJobId) {
    return this.request(`/generations/${encodeURIComponent(providerJobId)}`, { method: 'GET' });
  }

  async request(path, { method, body }) {
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : {}; } catch { payload = { raw: text }; }
    if (!response.ok) {
      const message = payload?.error?.message || payload?.message || `Seedance request failed (${response.status})`;
      throw new Error(message);
    }
    return payload;
  }
}
