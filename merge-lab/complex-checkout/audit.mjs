// In-memory receipt metadata only; no filesystem or external service is used.
export function recordPaymentAudit(context, quote, payment) {
  if (!payment.paid) throw new Error('Cannot audit an unpaid order');
  return {
    id: `audit:${context.orderId}`,
    traceId: context.traceId,
    orderId: context.orderId,
    currency: context.currency,
    total: quote.total,
    attempts: payment.attempts,
  };
}
