// @flow
import { BigNumber } from 'bignumber.js'
import { Observable } from 'rxjs'
import React from 'react'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import { getDerivations } from 'helpers/derivations'
import getAddress from 'commands/getAddress'
import last from 'lodash/last'
import signTransaction from 'commands/signTransaction'
import { parseAPIValue, getServer, formatAPICurrencyXLM } from 'api/Stellar'
import { Transaction as StrTransaction, Asset } from 'stellar-sdk'
import { StrKey } from 'stellar-base'
import AdvancedOptionsStellarKind from 'components/AdvancedOptions/StellarKind'
import { getAccountPlaceholderName } from 'helpers/accountName'
import { NotEnoughBalance } from 'config/errors'
import type { WalletBridge, EditProps } from './types'

type Transaction = {
  amount: BigNumber,
  recipient: string,
  fee: BigNumber,
  memoError?: ?string,
  memoType?: { label: string, value: ?string },
  memo?: ?string,
}

const paymentsToOperation = async (id, payments, currency, account) => {
  const parsedPayments = []
  for (const payment of payments) {
    let from
    let to
    let value

    if (payment.type === 'create_account') {
      from = payment.funder
      to = payment.account
      value = parseAPIValue(payment.starting_balance)
    } else {
      from = payment.from
      to = payment.to
      value = parseAPIValue(payment.amount)
    }

    const operation: Operation = {
      id: payment.id,
      hash: payment.transaction_hash,
      accountId: id,
      type: account === from ? 'OUT' : 'IN',
      value,
      fee: new BigNumber(100),
      blockHash: payment.transaction_hash,
      blockHeight: +payment.paging_token,
      senders: [from],
      recipients: [to],
      date: new Date(payment.created_at),
      transactionSequenceNumber: payment.transaction_hash,
    }

    if (payment.type === 'create_account') {
      operation.senders = [payment.funder]
      operation.recipients = [payment.account]
    }

    parsedPayments.push(operation)
  }
  return parsedPayments
}
const getBalanceFromAccount = account => {
  let balance = new BigNumber(0)

  if (Array.isArray(account.balances) && account.balances.length > 0) {
    const nativeBalance = account.balances.find(balance => balance.asset_type === 'native')
    if (nativeBalance) {
      balance = parseAPIValue(nativeBalance.balance)
    }
  }
  return balance
}
const signAndBroadcast = async ({
  a,
  t,
  deviceId,
  isCancelled,
  onSigned,
  onOperationBroadcasted,
}) => {
  const server = getServer()
  const amount = formatAPICurrencyXLM(t.amount)
  const signedTransactionXDR = await signTransaction
    .send({
      currencyId: a.currency.id,
      devicePath: deviceId,
      path: a.freshAddressPath,
      transaction: {
        freshAddress: a.freshAddress,
        destination: t.recipient,
        asset: Asset.native(),
        memo: t.memo,
        memoType: (t.memoType && t.memoType.value) || 'MEMO_NONE',
        amount,
      },
    })
    .toPromise()
  const signedTransaction = new StrTransaction(signedTransactionXDR)

  if (!isCancelled()) {
    onSigned()
    const transactionResult = await server.submitTransaction(signedTransaction)
    onOperationBroadcasted({
      id: `${a.id}-${transactionResult.hash}-OUT`,
      hash: transactionResult.hash,
      accountId: a.id,
      type: 'OUT',
      value: new BigNumber(t.amount),
      fee: new BigNumber(signedTransaction.fee),
      blockHash: null,
      blockHeight: null,
      senders: [signedTransaction.source],
      recipients: [t.recipient],
      date: new Date(),
      transactionSequenceNumber:
        (a.operations.length > 0 ? a.operations[0].transactionSequenceNumber : 0) +
        a.pendingOperations.length,
    })
  }
}
const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptionsStellarKind
    memo={value.memo}
    memoType={value.memoType}
    error={value.memoError}
    onChange={changedValue => {
      onChange({ ...value, ...changedValue })
    }}
  />
)
const mergeOps = (existing: Operation[], newFetched: Operation[]) => {
  const ids = existing.map(o => o.id)
  const all = existing.concat(newFetched.filter(o => !ids.includes(o.id)))
  return all.sort((a, b) => b.date - a.date)
}
const StellarJSBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice: (currency, deviceId) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }
      async function main() {
        try {
          const server = getServer()
          const derivation = getDerivations(currency)[0] // Ignore the standard, they don't comply with stellar

          for (let index = 0; index < 255; index++) {
            const freshAddressPath = derivation({ currency, x: index, segwit: false })
            const { publicKey: freshAddress } = await getAddress
              .send({ currencyId: currency.id, devicePath: deviceId, path: freshAddressPath })
              .toPromise()
            if (finished) return
            const accountId = `stellarjs:${currency.id}:${freshAddress}`
            try {
              const accountResult = await server.loadAccount(freshAddress)
              const balance = getBalanceFromAccount(accountResult)

              const account: Account = {
                id: accountId,
                xpub: '',
                name: getAccountPlaceholderName(currency, index),
                freshAddress,
                freshAddressPath,
                balance,
                blockHeight: 0, // None is synced yet
                index,
                currency,
                operations: [],
                pendingOperations: [],
                unit: currency.units[0],
                lastSyncDate: new Date(),
              }
              o.next(account)
            } catch (err) {
              // FIXME there might be other reasons for use reaching this point
              o.next({
                id: accountId,
                xpub: '',
                name: getAccountPlaceholderName(currency, index),
                freshAddress,
                freshAddressPath,
                balance: BigNumber(0),
                blockHeight: 0, // None is synced yet
                index,
                currency,
                operations: [],
                pendingOperations: [],
                archived: false,
                unit: currency.units[0],
                lastSyncDate: new Date(),
              })
              break
            }
          }
          o.complete()
        } catch (e) {
          throw e
        }
      }

      main()

      return unsubscribe
    }),
  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: '',
    fee: BigNumber(100),
    memo: undefined,
  }),
  getTransactionAmount: (a, t) => t.amount,
  getTransactionRecipient: (a, t) => t.recipient,
  getRecipientWarning: () => Promise.resolve(null),
  editTransactionRecipient: (account, t, recipient) => ({
    ...t,
    recipient,
  }),
  editTransactionAmount: (account, t, amount) => ({
    ...t,
    amount,
  }),
  isRecipientValid: (currency, recipient) => StrKey.isValidEd25519PublicKey(recipient),
  isValidTransaction: (a, t) => !t.amount.isZero() && t.recipient && !t.memoError,
  checkValidTransaction: async (a, t) => {
    if (t.memoError) {
      return false
    }
    if (t.amount.isLessThanOrEqualTo(a.balance.plus(t.fee))) {
      return true
    }
    throw new NotEnoughBalance()
  },
  getTotalSpent: (a, t) => Promise.resolve(t.amount.plus(t.fee)),
  getMaxAmount: (a, t) => Promise.resolve(a.balance.minus(t.fee)),
  EditAdvancedOptions,
  pullMoreOperations: () => Promise.resolve(a => a),
  signAndBroadcast: (a, t, deviceId) =>
    Observable.create(o => {
      let cancelled = false
      const isCancelled = () => cancelled
      const onSigned = () => {
        o.next({ type: 'signed' })
      }
      const onOperationBroadcasted = operation => {
        o.next({ type: 'broadcasted', operation })
      }
      signAndBroadcast({ a, t, deviceId, isCancelled, onSigned, onOperationBroadcasted }).then(
        () => {
          o.complete()
        },
        e => {
          o.error(e)
        },
      )
      return () => {
        cancelled = true
      }
    }),
  addPendingOperation: (account, operation) => ({
    ...account,
    pendingOperations: [operation].concat(
      account.pendingOperations.filter(
        o => o.transactionSequenceNumber === operation.transactionSequenceNumber,
      ),
    ),
  }),
  synchronize: ({ id, freshAddress, blockHeight, currency }) =>
    Observable.create(o => {
      let finished = false
      let done = false
      let balance

      const unsubscribe = () => {
        finished = true
      }

      async function main(_blockHeight) {
        const server = getServer()

        if (!balance) {
          try {
            const accountResult = await server.loadAccount(freshAddress)
            balance = getBalanceFromAccount(accountResult)
            o.next(a => ({
              ...a,
              inflationDestination: accountResult.inflation_destination || '',
            }))
          } catch (err) {
            // Account doesn't exist yet or we failed to sync it
            finished = true
          }
        }

        if (finished) return
        const payments = await server
          .payments()
          .cursor(_blockHeight)
          .forAccount(freshAddress)
          .order('asc')
          .limit(100)
          .call()

        const newOperations = []
        if (payments.records.length && last(payments.records).paging_token > _blockHeight) {
          newOperations.push(
            ...(await paymentsToOperation(id, payments.records, currency, freshAddress)),
          )
          _blockHeight = last(newOperations).blockHeight

          o.next(a => ({
            ...a,
            operations: mergeOps(a.operations, newOperations),
            _blockHeight,
          }))
        } else {
          const lastLedger = await server
            .ledgers()
            .limit(1)
            .order('desc')
            .call()

          o.next(a => ({
            ...a,
            balance,
            blockHeight: +lastLedger.records[0].paging_token,
            pendingOperations: [],
          }))
          done = true
        }

        if (!done) {
          main(_blockHeight)
        } else {
          o.complete()
        }
      }

      main(blockHeight)
      return unsubscribe
    }),
}
export default StellarJSBridge
