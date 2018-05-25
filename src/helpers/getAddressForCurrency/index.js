// @flow

import type Transport from '@ledgerhq/hw-transport'
import btc from './btc'
import ethereum from './ethereum'
import ripple from './ripple'

type Resolver = (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  options: *,
) => Promise<{ address: string, path: string, publicKey: string }>

type Module = (currencyId: string) => Resolver

const fallback: string => Resolver = currencyId => () =>
  Promise.reject(new Error(`${currencyId} device support not implemented`))

const all = {
  bitcoin: btc,
  bitcoin_testnet: btc,

  zcash: btc,
  bitcoin_cash: btc,
  bitcoin_gold: btc,
  zencash: btc,

  ethereum,
  ethereum_testnet: ethereum,
  ethereum_classic: ethereum,
  ethereum_classic_testnet: ethereum,

  ripple,
}

const getAddressForCurrency: Module = (currencyId: string) =>
  all[currencyId] || fallback(currencyId)

export default getAddressForCurrency
