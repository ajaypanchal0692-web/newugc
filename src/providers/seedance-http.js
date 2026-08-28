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
      if (!/^https?:\/\//i.test(url)) continue;
      content.push({ type: 'image_url', image_url: { url } });
    }

    const payload = {
      model: this.model,
      content,
      ratio: request.aspectRatio || '9:16',
      duration: Number(request.durationSeconds || 15),
      watermark: Boolean(request.watermark),
    };
    if (request.generateAudio !== undefined) payload.generate_audio = Boolean(request.generateAudio);
    if (request.resolution) payload.resolution = request.resolution;

    const result = await this.request('/contents/generations/tasks', { method: 'POST', body: payload });
    if (!result?.id) throw new Error('Seedance did not return a task id');
    return result;
  }

  async status(providerJobId) {
    const payload = await this.request(`/contents/generations/tasks/${encodeURIComponent(providerJobId)}`, { method: 'GET' });
    const status = String(payload?.status || '').toLowerCase();
    return {
      providerJobId,
      status: status === 'succeeded' ? 'completed' : ['failed', 'expired', 'cancelled', 'canceled'].includes(status) ? 'failed' : 'processing',
      outputUrl: payload?.content?.video_url || payload?.video_url || null,
      error: payload?.error?.message || payload?.error?.detail || null,
      raw: payload,
    };
  }

  async request(path, { method, body }) {
    const response = await this.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : {}; } catch { payload = { raw: text }; }
    if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `Seedance request failed (${response.status})`);
    return payload;
  }
}
