import { normalizeCustomer, validateCustomer, customerKey, receiptCustomer } from './customer.mjs';
import { quoteOrder, formatAmount, supportsShipping } from './pricing.mjs';
import { chargePayment } from './legacy-payment.mjs';
import { recordPaymentAudit } from './audit.mjs';

export const EXPECTED_STEP_COUNT = 6;

export function validateCart(input) {
  validateCustomer(input.customer);
  if (!input.id || !Array.isArray(input.items) || input.items.length === 0) {
    throw new Error('Order must have an ID and at least one item');
  }
  for (const item of input.items) {
    if (!item.sku || !Number.isFinite(item.price) || item.price <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Invalid cart item');
    }
  }
  if (!supportsShipping(input.shipping ?? 'standard')) {
    throw new Error('Unsupported shipping service');
  }
}

export function checkoutSteps() {
  return ['validate-cart', 'reserve-stock', 'calculate-tax', 'capture-payment', 'persist-audit', 'send-receipt'];
}

export function checkoutStepPosition(step) {
  return checkoutSteps().indexOf(step);
}

export function assertCheckoutSteps() {
  if (checkoutSteps().length !== EXPECTED_STEP_COUNT) {
    throw new Error('Checkout step count must match the pipeline');
  }
}

export function buildContext(input) {
  return { orderId: input.id, customer: normalizeCustomer(input.customer), currency: input.currency ?? 'USD', locale: input.locale ?? 'en', traceId: `trace:${input.id}` };
}

export function cartSummary(input) {
  return input.items.map(item => `${item.sku} x${item.quantity}`).join(', ');
}

export function itemCount(input) {
  return input.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function reviewBeforePayment(input) {
  return (input.availableStock ?? Infinity) >= itemCount(input);
}

export function rejectionMessage() {
  return 'Order rejected before payment';
}

export function receiptPrefix() {
  return 'Order receipt';
}

export function paymentRequest(input, context, quote) {
  return { orderId: input.id, amount: quote.total, currency: context.currency, simulatedFailures: input.simulatedFailures ?? 0, traceId: context.traceId };
}

export function isPaid(payment) {
  return payment.paid === true && typeof payment.paymentId === 'string';
}

export function formatReceipt(input, context, quote, payment, audit) {
  return `Order ${input.id} | ${receiptCustomer(input.customer, context.locale)} | ${formatAmount(quote.total, context.currency)} | Audit ${audit.id}`;
}

export function checkout(input) {
  validateCart(input);
  assertCheckoutSteps();
  const context = buildContext(input);
  const quote = quoteOrder(input);
  if (!reviewBeforePayment(input)) throw new Error(rejectionMessage());
  const payment = chargePayment(paymentRequest(input, context, quote));
  const audit = recordPaymentAudit(context, quote, payment);
  return { context, quote, payment, audit, receipt: formatReceipt(input, context, quote, payment, audit) };
}
