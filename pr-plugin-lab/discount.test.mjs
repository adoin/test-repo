import test from 'node:test';
import assert from 'node:assert/strict';
import { discountedPrice } from './discount.mjs';

test('twenty percent off a price of one hundred is eighty', () => {
  assert.equal(discountedPrice(100, 20), 80);
});

test('zero percent discount preserves the original price', () => {
  assert.equal(discountedPrice(100, 0), 100);
});
