// @flow

import type Transport from '@ledgerhq/hw-transport'
import btc from './btc'

type Resolver = (
  transport: Transport<*>,
  currencyId: string,
  bip32path: ?string, // if provided use this path, otherwise resolve it
  options: *,
) => Promise<string>

type Module = (currencyId: string) => Resolver

const fallback: string => Resolver = currencyId => () =>
  Promise.reject(new Error(`${currencyId} device support not implemented`))

const all = {
  bitcoin: btc,
  bitcoin_testnet: btc,

  ethereum: btc,
  ethereum_testnet: btc,
}

const module: Module = (currencyId: string) => all[currencyId] || fallback(currencyId)

export default module
