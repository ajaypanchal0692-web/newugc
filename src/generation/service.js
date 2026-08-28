import { createGenerationJob, updateGenerationJob, JOB_STATES } from './job.js';

export class GenerationService {
  constructor({ provider, store }) {
    this.provider = provider;
    this.store = store;
  }

  async submit({ projectId, prompt, durationSeconds, aspectRatio, referenceImage, generateAudio = true, resolution = '720p', watermark = false }) {
    const job = createGenerationJob({ projectId, prompt, provider: this.provider.name });
    await this.store.save(job);
    try {
      const remote = await this.provider.createGeneration({ prompt: job.prompt, durationSeconds, aspectRatio, referenceImage, generateAudio, resolution, watermark });
      const updated = updateGenerationJob(job, { status: JOB_STATES.PROCESSING, providerJobId: remote.id });
      await this.store.save(updated);
      return updated;
    } catch (error) {
      const failed = updateGenerationJob(job, { status: JOB_STATES.FAILED, error: error instanceof Error ? error.message : String(error) });
      await this.store.save(failed);
      return failed;
    }
  }

  async refresh(job) {
    if (!job.providerJobId) return job;
    const remote = await this.provider.getGenerationStatus(job.providerJobId);
    const updated = updateGenerationJob(job, { status: remote.status, outputUrl: remote.outputUrl ?? job.outputUrl, error: remote.error ?? job.error });
    await this.store.save(updated);
    return updated;
  }
}
