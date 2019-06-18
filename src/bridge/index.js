// @flow
import type { CryptoCurrency, Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import type { CurrencyBridge, AccountBridge } from '@ledgerhq/live-common/lib/bridge/types'
import {
  makeMockCurrencyBridge,
  makeMockAccountBridge,
} from '@ledgerhq/live-common/lib/bridge/makeMockBridge'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import { createCustomErrorClass } from '@ledgerhq/errors'
import { decodeAccountId } from '@ledgerhq/live-common/lib/account'
import * as LibcoreBridge from './LibcoreBridge'
import * as RippleJSBridge from './RippleJSBridge'
import * as EthereumJSBridge from './EthereumJSBridge'

// TODO as soon as it's in @ledgerhq/errors we can import it
const CurrencyNotSupported = createCustomErrorClass('CurrencyNotSupported')

const mockCurrencyBridge = makeMockCurrencyBridge()
const mockAccountBridge = makeMockAccountBridge()

export const getCurrencyBridge = (currency: CryptoCurrency): CurrencyBridge => {
  if (getEnv('MOCK')) return mockCurrencyBridge
  switch (currency.family) {
    case 'ripple':
      return RippleJSBridge.currencyBridge
    case 'ethereum':
      if (getEnv('EXPERIMENTAL_LIBCORE')) {
        return LibcoreBridge.currencyBridge
      }
      return EthereumJSBridge.currencyBridge
    case 'bitcoin':
      return LibcoreBridge.currencyBridge
    default:
      return mockCurrencyBridge // fallback mock until we implement it all!
  }
}

export const getAccountBridge = (
  account: Account | TokenAccount,
  parentAccount: ?Account,
): AccountBridge<any> => {
  const mainAccount = account.type === 'Account' ? account : parentAccount
  if (!mainAccount) throw new Error('an account expected')
  const { type } = decodeAccountId(mainAccount.id)
  if (type === 'mock') return mockAccountBridge
  if (type === 'libcore') return LibcoreBridge.accountBridge
  switch (mainAccount.currency.family) {
    case 'ripple':
      return RippleJSBridge.accountBridge
    case 'ethereum':
      return EthereumJSBridge.accountBridge
    default:
      throw new CurrencyNotSupported('currency not supported', {
        currencyName: mainAccount.currency.name,
      })
  }
}
