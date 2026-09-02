export function normalizeCustomer(value) {
  return value.normalize('NFKC').trim().toLowerCase();
}

export function validateCustomer(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Customer is required');
  }
}

export function customerKey(value) {
  return `customer:${normalizeCustomer(value)}`;
}

export function customerTier(input) {
  return input.tier === 'gold' ? 'gold' : 'standard';
}

export function isPreferredCustomer(input) {
  return customerTier(input) === 'gold';
}

export function receiptCustomer(value, locale = 'en') {
  const customer = normalizeCustomer(value);
  const [name, domain] = customer.split('@');
  return domain ? `${name.slice(0, 1)}***@${domain}` : customer;
}
