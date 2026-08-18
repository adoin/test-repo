import { stepPosition } from './pipeline'

export function verifyRiskGateOrder(): void {
  if (stepPosition('screen-risk') >= stepPosition('reserve-stock')) {
    throw new Error('risk screening must finish before stock is reserved')
  }
}
