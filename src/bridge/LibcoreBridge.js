// @flow
import React from 'react'
import { map } from 'rxjs/operators'
import { decodeAccount, encodeAccount } from 'reducers/accounts'
import FeesBitcoinKind from 'components/FeesField/BitcoinKind'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
// import AdvancedOptionsBitcoinKind from 'components/AdvancedOptions/BitcoinKind'
import type { WalletBridge, EditProps } from './types'

const notImplemented = new Error('LibcoreBridge: not implemented')

type Transaction = {
  amount: number,
  feePerByte: number,
  recipient: string,
}

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChange={feePerByte => {
      onChange({ ...value, feePerByte })
    }}
    feePerByte={value.feePerByte}
    account={account}
  />
)

const EditAdvancedOptions = undefined // Not implemented yet
/*
const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptionsBitcoinKind
    isRBF={value.isRBF}
    onChangeRBF={isRBF => {
      onChange({ ...value, isRBF })
    }}
  />
)
*/

const LibcoreBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice(currency, devicePath, observer) {
    return libcoreScanAccounts
      .send({
        devicePath,
        currencyId: currency.id,
      })
      .pipe(map(decodeAccount))
      .subscribe(observer)
  },

  synchronize(_initialAccount, _observer) {
    // FIXME TODO: use next(), to actually emit account updates.....
    // - need to sync the balance
    // - need to sync block height & block hash
    // - need to sync operations.
    // - once all that, need to set lastSyncDate to new Date()
    // - when you implement addPendingOperation you also here need to:
    //   - if there were pendingOperations that are now in operations, remove them as well.
    //   - if there are pendingOperations that is older than a threshold (that depends on blockchain speed typically)
    //     then we probably should trash them out? it's a complex question for UI
    return {
      unsubscribe() {
        console.warn('LibcoreBridge: sync not implemented')
      },
    }
  },

  pullMoreOperations: () => Promise.reject(notImplemented),

  isRecipientValid: (currency, recipient) => Promise.resolve(recipient.length > 0),

  createTransaction: () => ({
    amount: 0,
    recipient: '',
    feePerByte: 0,
    isRBF: false,
  }),

  editTransactionAmount: (account, t, amount) => ({
    ...t,
    amount,
  }),

  getTransactionAmount: (a, t) => t.amount,

  editTransactionRecipient: (account, t, recipient) => ({
    ...t,
    recipient,
  }),

  getTransactionRecipient: (a, t) => t.recipient,

  // $FlowFixMe why?
  EditFees,

  // $FlowFixMe why?
  EditAdvancedOptions,

  isValidTransaction: (a, t) => (t.amount > 0 && t.recipient && true) || false,

  canBeSpent: (a, t) => Promise.resolve(t.amount <= a.balance), // FIXME

  getTotalSpent: (a, t) => Promise.resolve(t.amount), // FIXME

  getMaxAmount: (a, _t) => Promise.resolve(a.balance), // FIXME

  signAndBroadcast: async (account, transaction, deviceId) => {
    const encodedAccount = encodeAccount(account)
    const rawOp = await libcoreSignAndBroadcast
      .send({
        account: encodedAccount,
        transaction,
        deviceId,
      })
      .toPromise()

    // quick HACK
    const [op] = decodeAccount({ ...encodedAccount, operations: [rawOp] }).operations

    return op
  },
}

export default LibcoreBridge
