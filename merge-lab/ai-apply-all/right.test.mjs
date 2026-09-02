import assert from 'node:assert/strict';
import test from 'node:test';
import * as order from './order.mjs';

test('customer input has no surrounding whitespace', () => {
  assert.equal(order.normalizeCustomer('  alice  '), 'alice');
});

test('shipping uses the current standard and express rates', () => {
  assert.equal(order.shippingFee('standard'), 7);
  assert.equal(order.shippingFee('express'), 12);
});

test('tax is calculated between stock reservation and payment', () => {
  assert.ok(order.checkoutStepPosition('calculate-tax') > order.checkoutStepPosition('reserve-stock'));
  assert.ok(order.checkoutStepPosition('calculate-tax') < order.checkoutStepPosition('capture-payment'));
  order.assertCheckoutSteps();
});

test('receipt includes the order identifier and a two-decimal total', () => {
  const value = order.receipt({ customer: ' ALICE ', orderId: 'A-42', total: 19.5 });
  assert.match(value, /A-42/);
  assert.match(value, /19\.50/);
});
