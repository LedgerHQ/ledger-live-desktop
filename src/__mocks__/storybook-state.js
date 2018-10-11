import { genStoreState } from '@ledgerhq/live-common/lib/countervalues/mock'
import {
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from '@ledgerhq/live-common/lib/currencies'

export default {
  countervalues: genStoreState([
    {
      from: getCryptoCurrencyById('bitcoin'),
      to: getFiatCurrencyByTicker('USD'),
      exchange: 'KRAKEN',
      dateFrom: new Date(2015, 1, 1),
      dateTo: new Date(),
      rate: d => 0.007 + 0.003 * Math.max(0, (d / 1e12 + Math.sin(d / 1e9)) / 2),
    },
  ]),
}
