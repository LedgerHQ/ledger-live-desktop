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

const all: CryptoCurrencyConfig<Resolver> = {
  bitcoin_cash: btc,
  bitcoin_gold: btc,
  bitcoin_testnet: btc,
  bitcoin: btc,
  dash: btc,
  digibyte: btc,
  dogecoin: btc,
  ethereum_classic: ethereum,
  ethereum_testnet: ethereum,
  ethereum,
  hcash: btc,
  komodo: btc,
  litecoin: btc,
  peercoin: btc,
  pivx: btc,
  poswallet: btc,
  qtum: btc,
  ripple,
  stealthcoin: btc,
  stratis: btc,
  vertcoin: btc,
  viacoin: btc,
  zcash: btc,
  zencash: btc,
}

const getAddressForCurrency: Module = (currencyId: string) => all[currencyId]

export default getAddressForCurrency
