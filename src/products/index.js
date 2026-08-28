/**
 * Product normalization and prompt utilities.
 * Image understanding should be implemented by a separate provider adapter.
 */

const ARRAY_FIELDS = ['key_benefits', 'features', 'claims'];

function clean(value) {
  return String(value ?? '').trim();
}

function cleanArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(clean).filter(Boolean);
}

export function normalizeProduct(input = {}) {
  const product = {
    name: clean(input.name),
    category: clean(input.category),
    brand: clean(input.brand),
    key_benefits: cleanArray(input.key_benefits),
    features: cleanArray(input.features),
    color: clean(input.color),
    material: clean(input.material),
    target_audience: clean(input.target_audience),
    price: clean(input.price),
    claims: cleanArray(input.claims),
    reference_image: clean(input.reference_image),
  };

  return product;
}

export function validateProduct(product = {}) {
  const normalized = normalizeProduct(product);
  const errors = [];
  if (!normalized.name) errors.push('name is required');
  if (!normalized.category) errors.push('category is required');
  return { valid: errors.length === 0, errors, product: normalized };
}

export function productPromptFragment(product = {}) {
  const p = normalizeProduct(product);
  const lines = [
    `Product: ${p.name}.`,
    `Category: ${p.category}.`,
    p.brand && `Brand: ${p.brand}.`,
    p.color && `Color: ${p.color}.`,
    p.material && `Material: ${p.material}.`,
    p.key_benefits.length && `Key benefits: ${p.key_benefits.join(', ')}.`,
    p.features.length && `Features: ${p.features.join(', ')}.`,
    p.target_audience && `Target audience: ${p.target_audience}.`,
    p.claims.length && `Approved claims: ${p.claims.join(', ')}.`,
  ];
  return lines.filter(Boolean).join('\n');
}

export { ARRAY_FIELDS };
