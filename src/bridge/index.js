// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { WalletBridge } from './types'
import UnsupportedBridge from './UnsupportedBridge'
import LibcoreBridge from './LibcoreBridge'
import EthereumJSBridge from './EthereumJSBridge'

const RippleJSBridge = UnsupportedBridge

export const getBridgeForCurrency = (currency: Currency): WalletBridge<any> => {
  if (currency.id.indexOf('ethereum') === 0) {
    return EthereumJSBridge // polyfill js
  }
  if (currency.id === 'ripple') {
    return RippleJSBridge // polyfill js
  }
  return LibcoreBridge // libcore for the rest
}
