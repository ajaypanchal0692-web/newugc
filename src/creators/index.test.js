import assert from 'node:assert/strict';
import test from 'node:test';
import { creatorPromptFragment, creatorSummary, getCreator } from './index.js';

const personas = [
  {
    id: 'male-01', name: 'Arjun', gender: 'male', age_range: '26-32', archetype: 'Confident everyday creator',
    appearance: 'Natural appearance.', performance: 'Conversational.', camera_presence: 'Direct eye contact.', voice: 'Warm voice.', best_for: ['fashion']
  }
];

test('finds a creator by id', () => {
  assert.equal(getCreator(personas, 'male-01').name, 'Arjun');
  assert.equal(getCreator(personas, 'missing'), null);
});

test('creates a prompt-ready creator fragment', () => {
  const fragment = creatorPromptFragment(personas[0]);
  assert.match(fragment, /Natural appearance/);
  assert.match(fragment, /Direct eye contact/);
});

test('creates a compact creator summary', () => {
  assert.deepEqual(creatorSummary(personas[0]), {
    id: 'male-01', name: 'Arjun', gender: 'male', ageRange: '26-32',
    archetype: 'Confident everyday creator', bestFor: ['fashion']
  });
});
