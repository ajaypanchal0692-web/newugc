import { creatorPromptFragment } from '../creators/index.js';
import { composePrompt } from './index.js';

/**
 * Compose a UGC prompt using a selected creator persona.
 */
export function composeCreatorPrompt(input, persona) {
  const creator = creatorPromptFragment(persona);
  return composePrompt({
    ...input,
    creator: [input.creator, creator].filter(Boolean).join(' '),
  });
}
