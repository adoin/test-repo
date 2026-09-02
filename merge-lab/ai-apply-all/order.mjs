export const EXPECTED_STEP_COUNT = 6;

export function normalizeCustomer(value) {
  return value.trim().toLowerCase();
}

// Keep the independent business rules separated so Git produces distinct hunks.
export function customerKey(value) {
  return `customer:${normalizeCustomer(value)}`;
}

export function isKnownCustomer(value) {
  return typeof value === 'string' && value.length > 0;
}

export function shippingFee(service) {
  return service === 'express' ? 12 : 7;
}

export function shippingLabel(service) {
  return service === 'express' ? 'Express delivery' : 'Standard delivery';
}

export function supportsShipping(service) {
  return service === 'standard' || service === 'express';
}

export function checkoutSteps() {
  return ['validate-cart', 'screen-risk', 'reserve-stock', 'calculate-tax', 'capture-payment', 'send-receipt'];
}

export function assertCheckoutSteps() {
  if (checkoutSteps().length !== EXPECTED_STEP_COUNT) {
    throw new Error('Checkout step count must match the pipeline');
  }
}

export function checkoutStepPosition(step) {
  return checkoutSteps().indexOf(step);
}

export function receipt({ customer, orderId, total }) {
  return `Receipt for ${normalizeCustomer(customer)}: ${orderId}, total ${total.toFixed(2)}`;
}

export function currencyCode() {
  return 'USD';
}

export function receiptPrefix() {
  return 'Receipt';
}
