// Combined requirements, to be run after resolving the merge. This never edits files.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { checkout, checkoutSteps, EXPECTED_STEP_COUNT, reviewBeforePayment } from './order.mjs';
import { normalizeCustomer, customerKey, receiptCustomer } from './customer.mjs';
import { quoteOrder } from './pricing.mjs';

assert.equal(normalizeCustomer('  ＡＤＡ   LOVELACE  '), 'ada lovelace');
assert.equal(customerKey('  ＡＤＡ   LOVELACE  '), 'customer:ada-lovelace');
assert.match(receiptCustomer('ADA@example.test', 'en-GB'), /a\*\*\*@example\.test/);
assert.match(receiptCustomer('ADA@example.test', 'en-GB'), /en-GB/);
assert.deepEqual(checkoutSteps(), ['validate-cart', 'screen-risk', 'reserve-stock', 'calculate-tax', 'capture-payment', 'persist-audit', 'send-receipt']);
assert.equal(EXPECTED_STEP_COUNT, 7);
const order = {
  id: 'ORDER-1042', customer: '  ADA@example.test  ', tier: 'gold', coupon: 'WELCOME5',
  items: [{ sku: 'BOOK', price: 50, quantity: 2 }], shipping: 'express', region: 'EU',
  currency: 'EUR', locale: 'en-GB', availableStock: 4, simulatedFailures: 2,
};
const result = checkout(order);
assert.deepEqual(result.quote, { subtotal: 100, discount: 15, shipping: 0, tax: 17, total: 102 });
assert.equal(result.payment.amountMinor, 10200);
assert.equal(result.payment.amount, 102);
assert.equal(result.payment.attempts, 3);
assert.equal(result.payment.currency, 'EUR');
assert.equal(result.payment.idempotencyKey, 'customer:ada@example.test:ORDER-1042');
assert.ok(result.audit?.id);
for (const text of ['ORDER-1042', '102.00', 'EUR', result.audit.id, 'a***@example.test', 'en-GB']) {
  assert.ok(result.receipt.includes(text), `Receipt must contain ${text}`);
}
assert.equal(reviewBeforePayment({ ...order, flagged: true }), false);
assert.equal(reviewBeforePayment({ ...order, availableStock: 0 }), false);
assert.throws(() => checkout({ ...order, simulatedFailures: 3 }), /Payment unavailable/);
const small = quoteOrder({ ...order, tier: 'standard', coupon: undefined, region: 'US', shipping: 'standard', items: [{ sku: 'BOOK', price: 50, quantity: 1 }] });
assert.deepEqual(small, { subtotal: 50, discount: 0, shipping: 7, tax: 4, total: 61 });
assert.equal(existsSync(new URL('./legacy-payment.mjs', import.meta.url)), false, 'Migrate retry behavior; do not restore the retired module');
console.log('PASS: combined pricing, normalization, privacy, pipeline, retry migration, audit and receipt requirements');
