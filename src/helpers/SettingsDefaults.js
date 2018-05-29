// @flow

import type { CryptoCurrencyConfig, CryptoCurrency } from '@ledgerhq/live-common/lib/types'

type ConfirmationDefaults = {
  confirmationsNb: ?{
    min: number,
    def: number,
    max: number,
  },
}

// This is approximated to be a 30mn confirmation in number of blocks on blockchains
// to disable the confirmations feature simply set 0.
const confirmationsNbPerCoin: CryptoCurrencyConfig<number> = {
  bitcoin: 2,
  ethereum: 120,
  ripple: 0,
  bitcoin_cash: 2,
  litecoin: 6,
  dash: 12,
  ethereum_classic: 120,
  qtum: 15,
  zcash: 12,
  bitcoin_gold: 2,
  stratis: 12, // FIXME can't grab the block time info anywhere...
  dogecoin: 30,
  hshare: 12, // FIXME can't grab the block time info anywhere...
  komodo: 30,
  pivx: 12, // FIXME can't grab the block time info anywhere...
  zencash: 12,
  vertcoin: 12,
  peercoin: 4,
  viacoin: 75,
  stealthcoin: 12, // FIXME can't grab the block time info anywhere...
  digibyte: 30,
  bitcoin_testnet: 2,
  ethereum_testnet: 120,
}

export const currencySettingsDefaults = (currency: CryptoCurrency): ConfirmationDefaults => {
  const confirmationsNbDef = confirmationsNbPerCoin[currency.id]
  return {
    confirmationsNb: confirmationsNbDef
      ? {
          min: 1,
          def: confirmationsNbDef,
          max: 100,
        }
      : null,
  }
}
