// @flow
import memoize from 'lodash/memoize'
import { listCryptoCurrencies as listCC } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { CryptoCurrencyIds } from '@ledgerhq/live-common/lib/types'

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
  'stealthcoin',
  'poswallet',
  'clubcoin',
  'stellar',
  'bitcoin_testnet',
]

export const listCryptoCurrencies = memoize((withDevCrypto?: boolean) =>
  listCC(withDevCrypto)
    .filter(c => supported.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name)),
)

export const splittedCurrencies = {
  bitcoin_cash: {
    coinType: 0,
  },
  bitcoin_gold: {
    coinType: 0,
  },
}
