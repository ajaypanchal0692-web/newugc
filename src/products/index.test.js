import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProduct, productPromptFragment, validateProduct } from './index.js';

test('normalizes product data', () => {
  const product = normalizeProduct({
    name: '  Cotton T-Shirt ',
    category: 'Fashion',
    key_benefits: ['Soft', '', 'Comfortable'],
    claims: ['Easy care'],
  });
  assert.equal(product.name, 'Cotton T-Shirt');
  assert.deepEqual(product.key_benefits, ['Soft', 'Comfortable']);
});

test('requires product name and category', () => {
  const result = validateProduct({});
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['name is required', 'category is required']);
});

test('creates a prompt-ready product fragment', () => {
  const fragment = productPromptFragment({
    name: 'Cotton T-Shirt', category: 'Fashion', color: 'Black',
    key_benefits: ['Soft fabric', 'Breathable'], features: ['Relaxed fit']
  });
  assert.match(fragment, /Cotton T-Shirt/);
  assert.match(fragment, /Soft fabric, Breathable/);
  assert.match(fragment, /Relaxed fit/);
});
