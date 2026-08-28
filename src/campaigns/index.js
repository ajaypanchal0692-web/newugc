import { composeProductUGCPrompt } from '../prompt-engine/product-integration.js';
import { validateProduct } from '../products/index.js';

const CONCEPTS = [
  { id: 'problem-solution', name: 'Problem → Solution', hook: 'Open with a relatable problem, then reveal the product as the practical solution.', tone: 'Relatable and persuasive' },
  { id: 'testimonial', name: 'Personal Testimonial', hook: 'Lead with a believable first-person result and show the product naturally in use.', tone: 'Authentic and trustworthy' },
  { id: 'demo', name: 'Fast Product Demo', hook: 'Show the product quickly, emphasizing its strongest visual feature and benefit.', tone: 'Energetic and clear' },
  { id: 'unboxing', name: 'Unboxing + First Impression', hook: 'Create anticipation, reveal the product, and capture a genuine first reaction.', tone: 'Excited and conversational' },
  { id: 'comparison', name: 'Before / After', hook: 'Contrast the old experience with the improved experience after using the product.', tone: 'Confident and benefit-led' },
];

function scenePlan(concept, durationSeconds) {
  const total = Number(durationSeconds) || 15;
  const hookEnd = Math.max(3, Math.round(total * 0.25));
  const demoEnd = Math.max(hookEnd + 3, Math.round(total * 0.65));
  return [
    { start: '00', end: String(hookEnd).padStart(2, '0'), label: 'Hook', action: concept.hook, camera: 'Natural handheld medium close-up, immediate visual engagement.' },
    { start: String(hookEnd).padStart(2, '0'), end: String(demoEnd).padStart(2, '0'), label: 'Product Moment', action: 'Introduce and demonstrate the product with clear, realistic hand interaction.', camera: 'Alternate medium and close-up product detail shots.' },
    { start: String(demoEnd).padStart(2, '0'), end: String(total).padStart(2, '0'), label: 'Payoff', action: 'Deliver the main benefit and a natural call to action.', camera: 'Return to direct-to-camera framing with the product visible.' },
  ];
}

export function generateCampaign(input = {}) {
  const productResult = validateProduct(input.product);
  if (!productResult.valid) return { valid: false, errors: productResult.errors, concepts: [] };

  const count = Math.min(Math.max(Number(input.conceptCount) || 5, 1), CONCEPTS.length);
  const concepts = CONCEPTS.slice(0, count).map((concept) => {
    const scenes = scenePlan(concept, input.durationSeconds);
    const prompt = composeProductUGCPrompt({
      product: productResult.product,
      persona: input.persona,
      category: input.category || 'UGC Advertising',
      tone: input.tone || concept.tone,
      goal: input.goal || 'Generate engaging product-focused social video',
      durationSeconds: input.durationSeconds || 15,
      aspectRatio: input.aspectRatio || '9:16',
      language: input.language || 'English',
      scenes,
    });
    return { ...concept, scenes, prompt };
  });

  return { valid: true, errors: [], concepts };
}

export function listConceptTypes() {
  return CONCEPTS.map(({ id, name }) => ({ id, name }));
}
