export function normalizeCustomer(value) {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateCustomer(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Customer is required');
  }
}

export function customerKey(value) {
  return `customer:${normalizeCustomer(value).replace(/\s/g, '-')}`;
}

export function customerTier(input) {
  return input.tier === 'gold' ? 'gold' : 'standard';
}

export function isPreferredCustomer(input) {
  return customerTier(input) === 'gold';
}

export function receiptCustomer(value, locale = 'en') {
  return `${normalizeCustomer(value)} (${locale})`;
}
