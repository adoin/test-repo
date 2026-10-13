import assert from 'node:assert/strict';
import test from 'node:test';
import { checkout, checkoutStepPosition } from './order.mjs';
import { normalizeCustomer, customerKey } from './customer.mjs';
import { quoteOrder, shippingFee } from './pricing.mjs';

const sample = () => ({ id: 'ORDER-1042', customer: 'ada@example.test', region: 'US', currency: 'USD', locale: 'en-GB', items: [{ sku: 'BOOK', price: 50, quantity: 1 }] });

test('customer names collapse internal whitespace and use hyphenated keys', () => {
  assert.equal(normalizeCustomer('Ada   Lovelace').split(' ').length, 2);
  assert.match(customerKey('ada   lovelace'), /ada-lovelace/);
});

test('coupon, current shipping rates and US tax remain available', () => {
  const quote = quoteOrder({ ...sample(), coupon: 'WELCOME5' });
  assert.equal(quote.discount, 5);
  assert.equal(quote.shipping, 7);
  assert.equal(quote.tax, 3.6);
  assert.equal(shippingFee('express', 50), 15);
});

test('stock check rejects orders before payment', () => {
  assert.throws(() => checkout({ ...sample(), availableStock: 0 }), /rejected before payment/);
  assert.ok(checkoutStepPosition('calculate-tax') < checkoutStepPosition('capture-payment'));
  assert.ok(checkoutStepPosition('persist-audit') > checkoutStepPosition('capture-payment'));
});

test('payment retries transient failures but has a strict maximum', () => {
  assert.equal(checkout({ ...sample(), simulatedFailures: 2 }).payment.attempts, 3);
  assert.throws(() => checkout({ ...sample(), simulatedFailures: 3 }), /Payment unavailable/);
});

test('receipt keeps locale, currency, order ID and audit trace', () => {
  const result = checkout(sample());
  for (const text of ['ORDER-1042', 'USD', 'en-GB', result.audit.id]) assert.ok(result.receipt.includes(text));
  assert.equal(result.audit.traceId, 'trace:ORDER-1042');
});
