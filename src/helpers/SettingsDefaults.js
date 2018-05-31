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
  bitcoin_cash: 2,
  bitcoin_gold: 2,
  bitcoin_testnet: 2,
  bitcoin: 2,
  dash: 12,
  digibyte: 30,
  dogecoin: 30,
  ethereum_classic: 120,
  ethereum_testnet: 120,
  ethereum: 120,
  hcash: 12, // FIXME can't grab the block time info anywhere...
  komodo: 30,
  litecoin: 6,
  peercoin: 4,
  pivx: 12, // FIXME can't grab the block time info anywhere...
  poswallet: 28,
  qtum: 15,
  ripple: 0,
  stealthcoin: 12, // FIXME can't grab the block time info anywhere...
  stratis: 12, // FIXME can't grab the block time info anywhere...
  vertcoin: 12,
  viacoin: 75,
  zcash: 12,
  zencash: 12,
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
