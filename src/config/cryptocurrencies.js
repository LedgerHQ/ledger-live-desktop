// @flow
import memoize from 'lodash/memoize'
import { listCryptoCurrencies as listCC } from '@ledgerhq/live-common/lib/currencies'
import type { CryptoCurrencyIds, CryptoCurrency } from '@ledgerhq/live-common/lib/types'

const supported: CryptoCurrencyIds[] = [
  'bitcoin',
  'ethereum',
  'ripple',
  'bitcoin_cash',
  'litecoin',
  'dash',
  'ethereum_classic',
  'qtum',
  'zcash',
  'bitcoin_gold',
  'stratis',
  'dogecoin',
  'digibyte',
  'hcash',
  'komodo',
  'pivx',
  'zencash',
  'vertcoin',
  'peercoin',
  'viacoin',
  'stakenet',
  'stealthcoin',
  'poswallet',
  'clubcoin',
  'decred',
  'bitcoin_testnet',
]

export const listCryptoCurrencies: (
  withDevCrypto?: boolean,
  onlyTerminated?: boolean,
  onlyInstallable?: boolean,
) => CryptoCurrency[] = memoize(
  (withDevCrypto, onlyTerminated = false, onlySupported = true) =>
    listCC(withDevCrypto, true)
      .filter(c => (onlySupported ? supported.includes(c.id) : true))
      .filter(c => (onlyTerminated ? c.terminated : !c.terminated))
      .sort((a, b) => a.name.localeCompare(b.name)),
  (a?: boolean, b?: boolean) => `${a ? 1 : 0}_${b ? 1 : 0}`,
)
