import { productPromptFragment } from '../products/index.js';
import { creatorPromptFragment } from '../creators/index.js';
import { composePrompt } from './index.js';

/**
 * Build a product-first UGC prompt from structured product and creator data.
 */
export function composeProductUGCPrompt({ product, persona, ...campaign }) {
  const productFragment = productPromptFragment(product);
  const creatorFragment = creatorPromptFragment(persona);

  return composePrompt({
    ...campaign,
    product: productFragment,
    creator: creatorFragment,
  });
}
