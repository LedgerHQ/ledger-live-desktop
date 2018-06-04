// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import invariant from 'invariant'
import { WalletBridge } from './types'
import LibcoreBridge from './LibcoreBridge'
import EthereumJSBridge from './EthereumJSBridge'
import RippleJSBridge from './RippleJSBridge'

const perFamily = {
  bitcoin: LibcoreBridge,
  ripple: RippleJSBridge,
  ethereum: EthereumJSBridge,
}

export const getBridgeForCurrency = (currency: Currency): WalletBridge<any> => {
  const bridge = perFamily[currency.family]
  invariant(bridge, `${currency.id} currency is not supported`)
  return bridge
}
