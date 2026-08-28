import assert from 'node:assert/strict';
import test from 'node:test';
import { generateCampaign, listConceptTypes } from './index.js';

const persona = {
  id: 'male-01', name: 'Arjun', gender: 'male', age_range: '26-32', archetype: 'Confident everyday creator',
  appearance: 'Approachable creator.', performance: 'Conversational.', camera_presence: 'Direct eye contact.', voice: 'Warm voice.'
};

const product = {
  name: 'Black Cotton T-Shirt', category: 'Fashion', brand: 'Example Brand',
  key_benefits: ['Soft fabric', 'Breathable'], features: ['Relaxed fit'], color: 'Black'
};

test('generates multiple campaign concepts', () => {
  const result = generateCampaign({ product, persona, conceptCount: 5, durationSeconds: 15, goal: 'Increase conversions' });
  assert.equal(result.valid, true);
  assert.equal(result.concepts.length, 5);
  assert.match(result.concepts[0].prompt, /Black Cotton T-Shirt/);
  assert.match(result.concepts[0].prompt, /\[00-04\] Hook/);
  assert.match(result.concepts[0].prompt, /Increase conversions/);
});

test('limits concept count to available strategies', () => {
  assert.equal(generateCampaign({ product, persona, conceptCount: 99 }).concepts.length, 5);
});

test('rejects incomplete product input', () => {
  const result = generateCampaign({ product: {}, persona });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['name is required', 'category is required']);
});

test('lists available concept types', () => {
  assert.equal(listConceptTypes().length, 5);
});
