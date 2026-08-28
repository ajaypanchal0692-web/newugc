export class MemoryGenerationStore {
  constructor() {
    this.jobs = new Map();
  }

  async save(job) {
    this.jobs.set(job.id, structuredClone(job));
    return job;
  }

  async get(id) {
    const job = this.jobs.get(id);
    return job ? structuredClone(job) : null;
  }
}
