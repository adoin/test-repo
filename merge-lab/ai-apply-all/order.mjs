export const EXPECTED_STEP_COUNT = 4;

export function normalizeCustomer(value) {
  return value;
}

// Keep the independent business rules separated so Git produces distinct hunks.
export function customerKey(value) {
  return `customer:${normalizeCustomer(value)}`;
}

export function isKnownCustomer(value) {
  return typeof value === 'string' && value.length > 0;
}

export function shippingFee(service) {
  return 5;
}

export function shippingLabel(service) {
  return service === 'express' ? 'Express delivery' : 'Standard delivery';
}

export function supportsShipping(service) {
  return service === 'standard' || service === 'express';
}

export function checkoutSteps() {
  return ['validate-cart', 'reserve-stock', 'capture-payment', 'send-receipt'];
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
  return `Receipt: ${orderId}`;
}

export function currencyCode() {
  return 'USD';
}

export function receiptPrefix() {
  return 'Receipt';
}

export function legacyReceiptLabel() {
  return 'Old receipt';
}
