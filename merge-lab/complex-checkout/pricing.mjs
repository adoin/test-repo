export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function subtotalFor(items) {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function discountFor(input, subtotal) {
<<<<<<< HEAD
  return input.tier === 'gold' ? roundMoney(subtotal * 0.1) : 0;
=======
  return input.coupon === 'WELCOME5' ? Math.min(5, subtotal) : 0;
>>>>>>> codex/complex-checkout-right
}

export function taxableAmount(subtotal, discount) {
  return Math.max(0, roundMoney(subtotal - discount));
}

export function supportsShipping(service) {
  return service === 'standard' || service === 'express';
}

export function shippingFee(service, subtotal) {
<<<<<<< HEAD
  if (subtotal >= 80) return 0;
  return service === 'express' ? 12 : 5;
=======
  return service === 'express' ? 15 : 7;
>>>>>>> codex/complex-checkout-right
}

export function shippingLabel(service) {
  return service === 'express' ? 'Express delivery' : 'Standard delivery';
}

export function formatAmount(value, currency) {
  return `${value.toFixed(2)} ${currency}`;
}

export function taxFee(amount, region) {
<<<<<<< HEAD
  return region === 'EU' ? roundMoney(amount * 0.2) : 0;
=======
  return region === 'US' ? roundMoney(amount * 0.08) : 0;
>>>>>>> codex/complex-checkout-right
}

export function quoteOrder(input) {
  const subtotal = subtotalFor(input.items);
  const discount = Math.min(subtotal, discountFor(input, subtotal));
  const shipping = shippingFee(input.shipping ?? 'standard', subtotal);
  const tax = taxFee(taxableAmount(subtotal, discount), input.region ?? 'US');
  return { subtotal, discount, shipping, tax, total: roundMoney(subtotal - discount + shipping + tax) };
}
