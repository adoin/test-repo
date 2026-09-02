export function normalizeCustomer(value) {
  return value.trim();
}

export function validateCustomer(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Customer is required');
  }
}

export function customerKey(value) {
  return normalizeCustomer(value);
}

export function customerTier(input) {
  return input.tier === 'gold' ? 'gold' : 'standard';
}

export function isPreferredCustomer(input) {
  return customerTier(input) === 'gold';
}

export function receiptCustomer(value, locale = 'en') {
  return normalizeCustomer(value);
}
