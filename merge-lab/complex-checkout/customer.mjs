export function normalizeCustomer(value) {
<<<<<<< HEAD
  return value.normalize('NFKC').trim().toLowerCase();
=======
  return value.trim().replace(/\s+/g, ' ');
>>>>>>> codex/complex-checkout-right
}

export function validateCustomer(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Customer is required');
  }
}

export function customerKey(value) {
<<<<<<< HEAD
  return `customer:${normalizeCustomer(value)}`;
=======
  return `customer:${normalizeCustomer(value).replace(/\s/g, '-')}`;
>>>>>>> codex/complex-checkout-right
}

export function customerTier(input) {
  return input.tier === 'gold' ? 'gold' : 'standard';
}

export function isPreferredCustomer(input) {
  return customerTier(input) === 'gold';
}

export function receiptCustomer(value, locale = 'en') {
<<<<<<< HEAD
  const customer = normalizeCustomer(value);
  const [name, domain] = customer.split('@');
  return domain ? `${name.slice(0, 1)}***@${domain}` : customer;
=======
  return `${normalizeCustomer(value)} (${locale})`;
>>>>>>> codex/complex-checkout-right
}
