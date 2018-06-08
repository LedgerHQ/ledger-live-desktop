// @flow
import { Observable } from 'rxjs'
import type { WalletBridge } from './types'

const genericError = new Error('UnsupportedBridge')

const UnsupportedBridge: WalletBridge<*> = {
  synchronize: () =>
    Observable.create(o => {
      o.error(genericError)
    }),

  scanAccountsOnDevice(currency, deviceId, { error }) {
    Promise.resolve(genericError).then(error)
    return { unsubscribe() {} }
  },

  pullMoreOperations: () => Promise.reject(genericError),

  isRecipientValid: () => Promise.reject(genericError),

  createTransaction: () => null,

  editTransactionAmount: () => null,

  getTransactionAmount: () => 0,

  isValidTransaction: () => false,

  editTransactionRecipient: () => null,

  getTransactionRecipient: () => '',

  canBeSpent: () => Promise.resolve(false),

  getTotalSpent: () => Promise.resolve(0),

  getMaxAmount: () => Promise.resolve(0),

  signAndBroadcast: () =>
    Observable.create(o => {
      o.error(genericError)
    }),
}

export default UnsupportedBridge
