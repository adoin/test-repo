import assert from 'node:assert/strict';
import test from 'node:test';
import { checkoutSteps, currencyCode, supportsShipping } from './order.mjs';

test('checkout keeps the original required steps', () => {
  for (const step of ['validate-cart', 'reserve-stock', 'capture-payment', 'send-receipt']) {
    assert.ok(checkoutSteps().includes(step));
  }
});

test('shipping services and currency remain compatible', () => {
  assert.equal(currencyCode(), 'USD');
  assert.ok(supportsShipping('standard'));
  assert.ok(supportsShipping('express'));
});
