// Local deterministic test double. No money is moved and no network is used.
export function chargePayment(request) {
  const maximumAttempts = 3;
  const failures = request.simulatedFailures ?? 0;
  if (failures >= maximumAttempts) throw new Error('Payment unavailable after 3 attempts');
  return {
    paid: true,
    paymentId: `payment:${request.orderId}`,
    amount: request.amount,
    currency: request.currency,
    attempts: failures + 1,
  };
}
