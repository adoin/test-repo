export const EXPECTED_CHECKOUT_STEP_COUNT = 4

export const CHECKOUT_PIPELINE = ['validate-cart', 'screen-risk', 'reserve-stock', 'capture-payment', 'send-receipt'] as const

export type CheckoutStep = (typeof CHECKOUT_PIPELINE)[number]

export function assertCheckoutPipeline(): void {
  if (CHECKOUT_PIPELINE.length !== EXPECTED_CHECKOUT_STEP_COUNT) {
    throw new Error(
      `checkout pipeline count mismatch: expected ${EXPECTED_CHECKOUT_STEP_COUNT}, got ${CHECKOUT_PIPELINE.length}`,
    )
  }
}

export function stepPosition(step: CheckoutStep): number {
  return CHECKOUT_PIPELINE.indexOf(step)
}
