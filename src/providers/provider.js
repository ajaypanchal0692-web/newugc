/**
 * Provider contract for video generation services.
 * Implementations should never expose provider secrets to callers.
 */

export class VideoProvider {
  constructor(name) {
    this.name = name;
  }

  async createGeneration() {
    throw new Error(`${this.name} provider does not implement createGeneration()`);
  }

  async getGenerationStatus() {
    throw new Error(`${this.name} provider does not implement getGenerationStatus()`);
  }
}

export const GENERATION_STATES = Object.freeze([
  'queued',
  'processing',
  'completed',
  'failed',
]);
