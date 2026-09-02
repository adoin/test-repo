// Local deterministic test double. No money is moved and no network is used.
export function chargePayment(request) {
  return {
    paid: true,
    paymentId: `payment:${request.orderId}`,
    amount: request.amount,
    currency: request.currency,
    attempts: 1,
  };
}
