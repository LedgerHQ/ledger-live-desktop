// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'

import makeMockBridge from 'bridge/makeMockBridge'

import { WalletBridge } from './types'
import LibcoreBridge from './LibcoreBridge'
import EthereumJSBridge from './EthereumJSBridge'
import RippleJSBridge from './RippleJSBridge'

export const getBridgeForCurrency = (currency: Currency): WalletBridge<any> => {
  if (currency.id.indexOf('ethereum') === 0) {
    return EthereumJSBridge // polyfill js
  }
  if (currency.id === 'ripple') {
    return RippleJSBridge // polyfill js
  }
  return makeMockBridge({})
  return LibcoreBridge // libcore for the rest
}
