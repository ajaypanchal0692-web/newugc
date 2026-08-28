import assert from 'node:assert/strict';
import test from 'node:test';
import { composePrompt, validatePromptInput } from './index.js';

test('composes a product UGC prompt', () => {
  const prompt = composePrompt({
    product: 'Black cotton t-shirt',
    creator: 'Confident Indian male creator, late 20s',
    category: 'UGC',
    tone: 'Authentic and energetic',
    goal: 'Drive product-page conversions',
    scenes: [{ start: '00', end: '05', label: 'Hook', action: 'Creator holds the product toward camera.', camera: 'Handheld medium close-up.' }],
  });

  assert.match(prompt, /Black cotton t-shirt/);
  assert.match(prompt, /Confident Indian male creator/);
  assert.match(prompt, /\[00-05\] Hook/);
  assert.match(prompt, /Vertical UGC video, 9:16/);
});

test('requires product and creator', () => {
  assert.deepEqual(validatePromptInput({}), {
    valid: false,
    errors: ['product is required', 'creator is required'],
  });
});

test('accepts valid required inputs', () => {
  assert.deepEqual(validatePromptInput({ product: 'Shoes', creator: 'Female creator' }), {
    valid: true,
    errors: [],
  });
});
