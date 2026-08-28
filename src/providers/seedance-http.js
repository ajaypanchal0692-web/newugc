/**
 * Server-side HTTP transport for the official Volcengine Ark video API.
 *
 * Seedance 2.0 uses POST /api/v3/contents/generations/tasks and returns an
 * asynchronous task ID. Credentials must remain server-side.
 */
export class SeedanceHttpTransport {
  constructor({
    baseUrl = process.env.SEEDANCE_API_URL || 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey = process.env.SEEDANCE_API_KEY || process.env.ARK_API_KEY,
    model = process.env.SEEDANCE_MODEL,
    fetchImpl = fetch,
  } = {}) {
    if (!apiKey) throw new Error('SEEDANCE_API_KEY or ARK_API_KEY is not configured');
    if (!model) throw new Error('SEEDANCE_MODEL is not configured');
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.model = model;
    this.fetch = fetchImpl;
  }

  async create(request) {
    const content = [{ type: 'text', text: request.prompt }];
    const referenceImages = Array.isArray(request.referenceImages)
      ? request.referenceImages
      : (request.referenceImage ? [request.referenceImage] : []);

    for (const url of referenceImages) {
      if (!url) continue;
      content.push({
        type: 'image_url',
        image_url: { url },
        role: 'reference_image',
      });
    }

    return this.request('/contents/generations/tasks', {
      method: 'POST',
      body: {
        model: this.model,
        content,
        ratio: request.aspectRatio || '9:16',
        duration: Number(request.durationSeconds || 15),
        resolution: request.resolution || '720p',
        generate_audio: request.generateAudio !== false,
        watermark: Boolean(request.watermark),
      },
    });
  }

  async status(providerJobId) {
    const payload = await this.request(`/contents/generations/tasks/${encodeURIComponent(providerJobId)}`, { method: 'GET' });
    const status = String(payload?.status || '').toLowerCase();
    const outputUrl = payload?.content?.video_url || payload?.video_url || payload?.content?.video?.url || null;

    return {
      providerJobId,
      status: ['succeeded', 'success', 'completed', 'done'].includes(status)
        ? 'completed'
        : ['failed', 'error', 'expired', 'canceled', 'cancelled'].includes(status)
          ? 'failed'
          : 'processing',
      outputUrl,
      error: payload?.error?.message || payload?.error?.detail || null,
      raw: payload,
    };
  }

  async request(path, { method, body }) {
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
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
