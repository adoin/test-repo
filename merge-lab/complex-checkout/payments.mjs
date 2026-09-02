// New local payment adapter: integer minor units and customer-scoped idempotency.
// No network calls, credentials or real charges are involved.
export function capturePayment(request) {
  if (!Number.isInteger(request.amountMinor) || request.amountMinor < 0) {
    throw new Error('Payment amount must use non-negative integer minor units');
  }
  if (!request.idempotencyKey) throw new Error('Idempotency key is required');
  return {
    paid: true,
    paymentId: `payment:${request.orderId}`,
    amountMinor: request.amountMinor,
    amount: request.amountMinor / 100,
    currency: request.currency,
    idempotencyKey: request.idempotencyKey,
    attempts: 1,
  };
}
