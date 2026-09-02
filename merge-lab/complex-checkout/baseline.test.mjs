import assert from 'node:assert/strict';
import test from 'node:test';
import { checkout, checkoutSteps, assertCheckoutSteps } from './order.mjs';

const sample = () => ({ id: 'ORDER-1042', customer: 'ada@example.test', items: [{ sku: 'BOOK', price: 20, quantity: 1 }] });

test('checkout stays a local deterministic operation with a complete receipt', () => {
  const result = checkout(sample());
  assert.equal(result.payment.paid, true);
  assert.match(result.receipt, /ORDER-1042/);
  assert.match(result.receipt, new RegExp(result.quote.total.toFixed(2)));
});

test('invalid items are rejected before payment', () => {
  assert.throws(() => checkout({ ...sample(), items: [] }), /at least one item/);
  assert.throws(() => checkout({ ...sample(), items: [{ sku: 'BOOK', price: -1, quantity: 1 }] }), /Invalid cart item/);
});

test('the declared pipeline count and core stages remain consistent', () => {
  assertCheckoutSteps();
  for (const step of ['validate-cart', 'reserve-stock', 'capture-payment', 'send-receipt']) {
    assert.ok(checkoutSteps().includes(step));
  }
});

test('the quote and charged amount agree', () => {
  const { quote, payment } = checkout(sample());
  assert.equal(quote.total, Math.round((quote.subtotal - quote.discount + quote.shipping + quote.tax) * 100) / 100);
  assert.equal(payment.amount, quote.total);
});
