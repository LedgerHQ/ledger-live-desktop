// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import invariant from 'invariant'
import { USE_MOCK_DATA } from 'config/constants'
import { WalletBridge } from './types'
import LibcoreBridge from './LibcoreBridge'
import EthereumJSBridge from './EthereumJSBridge'
import RippleJSBridge from './RippleJSBridge'
import makeMockBridge from './makeMockBridge'

const perFamily = {
  bitcoin: LibcoreBridge,
  ripple: RippleJSBridge,
  ethereum: EthereumJSBridge,
  stellar: null,
}
if (USE_MOCK_DATA) {
  const mockBridge = makeMockBridge()
  perFamily.bitcoin = mockBridge
  perFamily.ethereum = mockBridge
  perFamily.ripple = mockBridge
}
export const getBridgeForCurrency = (currency: Currency): WalletBridge<any> => {
  const bridge = perFamily[currency.family]
  invariant(bridge, `${currency.id} currency is not supported`)
  return bridge
}
