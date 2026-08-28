/**
 * Creator persona utilities. Personas are data-driven so the UI can later
 * select, preview and customize creators without changing prompt logic.
 */

export function getCreator(personas, id) {
  return personas.find((persona) => persona.id === id) ?? null;
}

export function creatorPromptFragment(persona) {
  if (!persona) return '';

  return [
    persona.appearance,
    `Performance: ${persona.performance}`,
    `Camera presence: ${persona.camera_presence}`,
    `Voice: ${persona.voice}`,
  ].filter(Boolean).join(' ');
}

export function creatorSummary(persona) {
  if (!persona) return null;
  return {
    id: persona.id,
    name: persona.name,
    gender: persona.gender,
    ageRange: persona.age_range,
    archetype: persona.archetype,
    bestFor: persona.best_for ?? [],
  };
}
