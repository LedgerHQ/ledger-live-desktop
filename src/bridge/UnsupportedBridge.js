// @flow
import { Observable } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import type { WalletBridge } from './types'

const genericError = new Error('UnsupportedBridge')

const UnsupportedBridge: WalletBridge<*> = {
  synchronize: () =>
    Observable.create(o => {
      o.error(genericError)
    }),

  scanAccountsOnDevice: () =>
    Observable.create(o => {
      o.error(genericError)
    }),

  pullMoreOperations: () => Promise.reject(genericError),

  isRecipientValid: () => Promise.reject(genericError),

  createTransaction: () => null,

  editTransactionAmount: () => null,

  getTransactionAmount: () => BigNumber(0),

  isValidTransaction: () => false,

  editTransactionRecipient: () => null,

  getTransactionRecipient: () => '',

  checkCanBeSpent: () => Promise.resolve(),

  getTotalSpent: () => Promise.resolve(BigNumber(0)),

  getMaxAmount: () => Promise.resolve(BigNumber(0)),

  signAndBroadcast: () =>
    Observable.create(o => {
      o.error(genericError)
    }),
}

export default UnsupportedBridge
