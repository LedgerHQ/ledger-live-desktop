// @flow
import memoize from 'lodash/memoize'
import { listCryptoCurrencies as listCC } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { CryptoCurrencyIds } from '@ledgerhq/live-common/lib/types'

const supported: CryptoCurrencyIds[] = [
  'bitcoin',
  'bitcoin_cash',
  'bitcoin_gold',
  'bitcoin_testnet',
  'clubcoin',
  'dash',
  'digibyte',
  'dogecoin',
  'ethereum',
  'ethereum_classic',
  'hcash',
  'komodo',
  'litecoin',
  'peercoin',
  'pivx',
  'poswallet',
  'qtum',
  'ripple',
  'stealthcoin',
  'stratis',
  'ubiq',
  'vertcoin',
  'viacoin',
  'zcash',
  'zencash',
]

export const listCryptoCurrencies = memoize((withDevCrypto?: boolean) =>
  listCC(withDevCrypto)
    .filter(c => supported.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name)),
)
