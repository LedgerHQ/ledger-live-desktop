// @flow
import React from 'react'
import { ipcRenderer } from 'electron'
import { decodeAccount } from 'reducers/accounts'
import runJob from 'renderer/runJob'
import FeesBitcoinKind from 'components/FeesField/BitcoinKind'
import AdvancedOptionsBitcoinKind from 'components/AdvancedOptions/BitcoinKind'
import type { WalletBridge, EditProps } from './types'

const notImplemented = new Error('LibcoreBridge: not implemented')

// TODO for ipcRenderer listeners we should have a concept of requestId because
// to be able to listen to events that only concerns you

// IMPORTANT: please read ./types.js that specify & document everything

type Transaction = *

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChange={feePerByte => {
      onChange({ ...value, feePerByte })
    }}
    feePerByte={value.feePerByte}
    account={account}
  />
)

const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptionsBitcoinKind
    isRBF={value.isRBF}
    onChangeRBF={isRBF => {
      onChange({ ...value, isRBF })
    }}
  />
)

const LibcoreBridge: WalletBridge<Transaction> = {
  synchronize(initialAccount, { next, complete, error }) {
    const unbind = () => ipcRenderer.removeListener('msg', handleAccountSync)

    function handleAccountSync(e, msg) {
      switch (msg.type) {
        case 'account.sync.progress': {
          next(a => a)
          // use next(), to actually emit account updates.....
          break
        }
        case 'account.sync.fail': {
          unbind()
          error(new Error('failed')) // TODO more error detail
          break
        }
        case 'account.sync.success': {
          unbind()
          complete()
          break
        }
        default:
      }
    }

    ipcRenderer.on('msg', handleAccountSync)

    // TODO how to start the sync ?!

    return {
      unsubscribe() {
        unbind()
        console.warn('LibcoreBridge: interrupting synchronization is not supported')
      },
    }
  },

  scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
    const unbind = () => ipcRenderer.removeListener('msg', handleMsgEvent)

    function handleMsgEvent(e, { data, type }) {
      if (type === 'accounts.scanAccountsOnDevice.accountScanned') {
        next({ ...decodeAccount(data), archived: true })
      }
    }

    ipcRenderer.on('msg', handleMsgEvent)

    let unsubscribed

    runJob({
      channel: 'accounts',
      job: 'scan',
      successResponse: 'accounts.scanAccountsOnDevice.success',
      errorResponse: 'accounts.scanAccountsOnDevice.fail',
      data: {
        devicePath: deviceId,
        currencyId: currency.id,
      },
    }).then(
      () => {
        if (unsubscribed) return
        unbind()
        complete()
      },
      e => {
        if (unsubscribed) return
        unbind()
        error(e)
      },
    )

    return {
      unsubscribe() {
        unsubscribed = true
        unbind()
        console.warn('LibcoreBridge: interrupting scanAccounts is not implemented') // FIXME
      },
    }
  },

  refreshLastOperations: () => Promise.reject(notImplemented),

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

  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.feePerByte),

  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.feePerByte),

  signAndBroadcast: () => Promise.reject(notImplemented),
}

export default LibcoreBridge
