import assert from 'node:assert/strict';
import test from 'node:test';
import { checkout, checkoutStepPosition } from './order.mjs';
import { normalizeCustomer, customerKey, receiptCustomer } from './customer.mjs';
import { quoteOrder } from './pricing.mjs';

const sample = () => ({ id: 'ORDER-1042', customer: '  ADA@example.test  ', tier: 'gold', region: 'EU', items: [{ sku: 'BOOK', price: 50, quantity: 2 }] });

test('customer identity normalizes Unicode and case', () => {
  assert.equal(normalizeCustomer('  ＡＤＡ  '), 'ada');
  assert.equal(customerKey('  ADA@example.test  '), 'customer:ada@example.test');
});

test('receipts do not expose the full email user name', () => {
  assert.match(receiptCustomer('ADA@example.test'), /a\*\*\*@example\.test/);
  assert.match(checkout(sample()).receipt, /a\*\*\*@example\.test/);
});

test('gold discount, free shipping and EU tax remain available', () => {
  const quote = quoteOrder(sample());
  assert.equal(quote.discount, 10);
  assert.equal(quote.shipping, 0);
  assert.equal(quote.tax, 18);
});

test('risk screening comes before inventory and rejects flagged orders', () => {
  assert.ok(checkoutStepPosition('screen-risk') < checkoutStepPosition('reserve-stock'));
  assert.throws(() => checkout({ ...sample(), flagged: true }), /rejected before payment/);
});

test('new payment API carries integer minor units and customer scope', () => {
  const result = checkout(sample());
  assert.equal(result.payment.amountMinor, Math.round(result.quote.total * 100));
  assert.equal(result.payment.idempotencyKey, 'customer:ada@example.test:ORDER-1042');
});
