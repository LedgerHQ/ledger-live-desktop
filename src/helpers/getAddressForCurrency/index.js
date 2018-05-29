// @flow

import type { CryptoCurrencyConfig } from '@ledgerhq/live-common/lib/types'
import type Transport from '@ledgerhq/hw-transport'
import btc from './btc'
import ethereum from './ethereum'
import ripple from './ripple'

type Resolver = (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  options: {
    segwit?: boolean,
    verify?: boolean,
  },
) => Promise<{ address: string, path: string, publicKey: string }>

type Module = (currencyId: string) => Resolver

const fallback: string => Resolver = currencyId => () =>
  Promise.reject(new Error(`${currencyId} device support not implemented`))

const all: CryptoCurrencyConfig<Resolver> = {
  bitcoin: btc,
  bitcoin_testnet: btc,

  litecoin: btc,

  zcash: btc,
  bitcoin_cash: btc,
  bitcoin_gold: btc,
  zencash: btc,

  ethereum,
  ethereum_testnet: ethereum,
  ethereum_classic: ethereum,

  ripple,

  // TODO port of all these
  viacoin: fallback('viacoin'),
  vertcoin: fallback('vertcoin'),
  stratis: fallback('stratis'),
  stealthcoin: fallback('stealthcoin'),
  qtum: fallback('qtum'),
  pivx: fallback('pivx'),
  peercoin: fallback('peercoin'),
  komodo: fallback('komodo'),
  hcash: fallback('hcash'),
  dogecoin: fallback('dogecoin'),
  digibyte: fallback('digibyte'),
  dash: fallback('dash'),
}

const getAddressForCurrency: Module = (currencyId: string) => all[currencyId]

export default getAddressForCurrency
