import {
  assertCheckoutPipeline,
  CHECKOUT_PIPELINE,
  EXPECTED_CHECKOUT_STEP_COUNT,
  stepPosition,
} from './pipeline'

export function verifyCheckoutPipelineContract(): void {
  assertCheckoutPipeline()

  if (CHECKOUT_PIPELINE.length !== EXPECTED_CHECKOUT_STEP_COUNT) {
    throw new Error('pipeline count must match its exported contract')
  }

  if (stepPosition('validate-cart') >= stepPosition('reserve-stock')) {
    throw new Error('cart validation must happen before stock reservation')
  }

  if (stepPosition('reserve-stock') >= stepPosition('capture-payment')) {
    throw new Error('stock reservation must happen before payment capture')
  }
}
