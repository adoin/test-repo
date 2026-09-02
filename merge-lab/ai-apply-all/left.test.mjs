import assert from 'node:assert/strict';
import test from 'node:test';
import * as order from './order.mjs';

test('customer identifiers are trimmed and case insensitive', () => {
  assert.equal(order.normalizeCustomer('  ALICE  '), 'alice');
});

test('express shipping costs more than standard shipping', () => {
  assert.ok(order.shippingFee('express') > order.shippingFee('standard'));
});

test('risk screening runs before reserving stock', () => {
  assert.ok(order.checkoutStepPosition('screen-risk') > order.checkoutStepPosition('validate-cart'));
  assert.ok(order.checkoutStepPosition('screen-risk') < order.checkoutStepPosition('reserve-stock'));
  order.assertCheckoutSteps();
});

test('receipt identifies the normalized customer and retires the old label', () => {
  assert.match(order.receipt({ customer: ' ALICE ', orderId: 'A-42', total: 19.5 }), /alice/);
  assert.equal('legacyReceiptLabel' in order, false);
});
