/**
 * Compose a Seedance-compatible UGC prompt from structured inputs.
 * Provider-specific API calls should remain outside this module.
 */

const DEFAULTS = {
  durationSeconds: 15,
  aspectRatio: '9:16',
  language: 'English',
};

function clean(value) {
  return String(value ?? '').trim();
}

function sceneBlock(scene, index) {
  const start = clean(scene.start);
  const end = clean(scene.end);
  const label = clean(scene.label) || `Shot ${index + 1}`;
  const action = clean(scene.action);
  const camera = clean(scene.camera);
  const dialogue = clean(scene.dialogue);

  return [
    `[${start}-${end}] ${label}`,
    action && `Action: ${action}`,
    camera && `Camera: ${camera}`,
    dialogue && `Dialogue: ${dialogue}`,
  ].filter(Boolean).join('\n');
}

/**
 * @param {Object} input
 * @param {string} input.product
 * @param {string} input.creator
 * @param {string} [input.category]
 * @param {string} [input.tone]
 * @param {string} [input.goal]
 * @param {Object[]} [input.scenes]
 * @returns {string}
 */
export function composePrompt(input = {}) {
  const duration = input.durationSeconds ?? DEFAULTS.durationSeconds;
  const ratio = input.aspectRatio ?? DEFAULTS.aspectRatio;
  const language = input.language ?? DEFAULTS.language;

  const sections = [
    `Format: Vertical UGC video, ${ratio}.`,
    `Duration: ${duration} seconds.`,
    `Language: ${language}.`,
    input.category && `Category: ${clean(input.category)}.`,
    input.product && `Product: ${clean(input.product)}.`,
    input.creator && `Creator: ${clean(input.creator)}.`,
    input.tone && `Tone: ${clean(input.tone)}.`,
    input.goal && `Campaign goal: ${clean(input.goal)}.`,
  ].filter(Boolean);

  if (Array.isArray(input.scenes) && input.scenes.length) {
    sections.push('\nScript:');
    sections.push(input.scenes.map(sceneBlock).join('\n\n'));
  }

  sections.push('\nQuality requirements: natural human performance, consistent creator identity, stable product appearance, realistic hand/object interaction, coherent camera motion, clean composition, and social-media-ready pacing.');

  return sections.join('\n');
}

export function validatePromptInput(input = {}) {
  const errors = [];
  if (!clean(input.product)) errors.push('product is required');
  if (!clean(input.creator)) errors.push('creator is required');
  if (input.durationSeconds != null && (!Number.isFinite(Number(input.durationSeconds)) || Number(input.durationSeconds) <= 0)) {
    errors.push('durationSeconds must be a positive number');
  }
  return { valid: errors.length === 0, errors };
}

export { DEFAULTS };
