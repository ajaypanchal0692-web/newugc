import { VideoProvider } from './provider.js';

export class SeedanceProvider extends VideoProvider {
  constructor({ transport }) {
    super('seedance');
    if (!transport || typeof transport.create !== 'function' || typeof transport.status !== 'function') {
      throw new TypeError('SeedanceProvider requires a transport with create() and status()');
    }
    this.transport = transport;
  }

  async createGeneration(request) {
    return this.transport.create({
      prompt: request.prompt,
      durationSeconds: request.durationSeconds,
      aspectRatio: request.aspectRatio,
      referenceImage: request.referenceImage,
      generateAudio: request.generateAudio,
      resolution: request.resolution,
      watermark: request.watermark,
    });
  }

  async getGenerationStatus(providerJobId) {
    return this.transport.status(providerJobId);
  }
}
