// @flow
/* eslint-disable no-param-reassign */
import invariant from 'invariant'
import { BigNumber } from 'bignumber.js'
import { Observable } from 'rxjs'
import { RippleAPI } from 'ripple-lib'
import bs58check from 'ripple-bs58check'
import { computeBinaryTransactionHash } from 'ripple-hashes'
import throttle from 'lodash/throttle'
import {
  NotEnoughBalanceBecauseDestinationNotCreated,
  NotEnoughBalance,
  InvalidAddress,
  FeeNotLoaded,
  NetworkDown,
  InvalidAddressBecauseDestinationIsAlsoSource,
} from '@ledgerhq/errors'
import type { Account, Operation, Unit } from '@ledgerhq/live-common/lib/types'
import type { CurrencyBridge, AccountBridge } from '@ledgerhq/live-common/lib/bridge/types'
import {
  getDerivationModesForCurrency,
  getDerivationScheme,
  runDerivationScheme,
  isIterableDerivationMode,
  derivationModeSupportsIndex,
} from '@ledgerhq/live-common/lib/derivation'
import {
  getAccountPlaceholderName,
  getNewAccountPlaceholderName,
} from '@ledgerhq/live-common/lib/account'
import {
  apiForEndpointConfig,
  defaultEndpoint,
  parseAPIValue,
  parseAPICurrencyObject,
  formatAPICurrencyXRP,
} from '@ledgerhq/live-common/lib/api/Ripple'
import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'

export type Transaction = {
  amount: BigNumber,
  recipient: string,
  fee: ?BigNumber,
  networkInfo: ?{ serverFee: BigNumber },
  tag: ?number,
  feeCustomUnit: ?Unit,
}

async function signAndBroadcast({ a, t, deviceId, isCancelled, onSigned, onOperationBroadcasted }) {
  const api = apiForEndpointConfig(RippleAPI, a.endpointConfig)
  const { fee } = t
  if (!fee) throw new FeeNotLoaded()
  try {
    await api.connect()
    const amount = formatAPICurrencyXRP(t.amount)
    const payment = {
      source: {
        address: a.freshAddress,
        amount,
      },
      destination: {
        address: t.recipient,
        minAmount: amount,
        tag: t.tag,
      },
    }
    const instruction = {
      fee: formatAPICurrencyXRP(fee).value,
      maxLedgerVersionOffset: 12,
    }

    const prepared = await api.preparePayment(a.freshAddress, payment, instruction)

    const transaction = await signTransaction
      .send({
        currencyId: a.currency.id,
        devicePath: deviceId,
        path: a.freshAddressPath,
        transaction: JSON.parse(prepared.txJSON),
      })
      .toPromise()

    if (!isCancelled()) {
      onSigned()
      const submittedPayment = await api.submit(transaction)

      if (submittedPayment.resultCode !== 'tesSUCCESS') {
        throw new Error(submittedPayment.resultMessage)
      }

      const hash = computeBinaryTransactionHash(transaction)
      const operation = {
        id: `${a.id}-${hash}-OUT`,
        hash,
        accountId: a.id,
        type: 'OUT',
        value: t.amount,
        fee,
        blockHash: null,
        blockHeight: null,
        senders: [a.freshAddress],
        recipients: [t.recipient],
        date: new Date(),
        // we probably can't get it so it's a predictive value
        transactionSequenceNumber:
          (a.operations.length > 0 ? a.operations[0].transactionSequenceNumber : 0) +
          a.pendingOperations.length,
        extra: {},
      }

      if (t.tag) {
        operation.extra.tag = t.tag
      }
      onOperationBroadcasted(operation)
    }
  } catch (e) {
    if (e && e.name === 'RippledError' && e.data.resultMessage) {
      throw new Error(e.data.resultMessage)
    }
    throw e
  } finally {
    api.disconnect()
  }
}

function isRecipientValid(recipient) {
  try {
    bs58check.decode(recipient)
    return true
  } catch (e) {
    return false
  }
}

function checkValidRecipient(account, recipient) {
  if (account.freshAddress === recipient) {
    return Promise.reject(new InvalidAddressBecauseDestinationIsAlsoSource())
  }

  try {
    bs58check.decode(recipient)
    return Promise.resolve(null)
  } catch (e) {
    return Promise.reject(new InvalidAddress('', { currencyName: account.currency.name }))
  }
}

function mergeOps(existing: Operation[], newFetched: Operation[]) {
  const ids = existing.map(o => o.id)
  const all = existing.concat(newFetched.filter(o => !ids.includes(o.id)))
  return all.sort((a, b) => b.date - a.date)
}

type Tx = {
  type: string,
  address: string,
  sequence: number,
  id: string,
  specification: {
    source: {
      address: string,
      maxAmount: {
        currency: string,
        value: string,
      },
    },
    destination: {
      address: string,
      amount: {
        currency: string,
        value: string,
      },
      tag?: string,
    },
    paths: string,
  },
  outcome: {
    result: string,
    fee: string,
    timestamp: string,
    deliveredAmount?: {
      currency: string,
      value: string,
      counterparty: string,
    },
    balanceChanges: {
      [addr: string]: Array<{
        counterparty: string,
        currency: string,
        value: string,
      }>,
    },
    orderbookChanges: {
      [addr: string]: Array<{
        direction: string,
        quantity: {
          currency: string,
          value: string,
        },
        totalPrice: {
          currency: string,
          counterparty: string,
          value: string,
        },
        makeExchangeRate: string,
        sequence: number,
        status: string,
      }>,
    },
    ledgerVersion: number,
    indexInLedger: number,
  },
}

const txToOperation = (account: Account) => ({
  id,
  sequence,
  outcome: { fee, deliveredAmount, ledgerVersion, timestamp },
  specification: { source, destination },
}: Tx): ?Operation => {
  const type = source.address === account.freshAddress ? 'OUT' : 'IN'
  let value = deliveredAmount ? parseAPICurrencyObject(deliveredAmount) : BigNumber(0)
  const feeValue = parseAPIValue(fee)
  if (type === 'OUT') {
    if (!Number.isNaN(feeValue)) {
      value = value.plus(feeValue)
    }
  }

  const op: $Exact<Operation> = {
    id: `${account.id}-${id}-${type}`,
    hash: id,
    accountId: account.id,
    type,
    value,
    fee: feeValue,
    blockHash: null,
    blockHeight: ledgerVersion,
    senders: [source.address],
    recipients: [destination.address],
    date: new Date(timestamp),
    transactionSequenceNumber: sequence,
    extra: {},
  }
  if (destination.tag) {
    op.extra.tag = destination.tag
  }
  return op
}

const getServerInfo = (map => endpointConfig => {
  if (!endpointConfig) endpointConfig = ''
  if (map[endpointConfig]) return map[endpointConfig]()
  const f = throttle(async () => {
    const api = apiForEndpointConfig(RippleAPI, endpointConfig)
    try {
      await api.connect()
      const res = await api.getServerInfo()
      return res
    } catch (e) {
      f.cancel()
      throw e
    } finally {
      api.disconnect()
    }
  }, 60000)
  map[endpointConfig] = f
  return f()
})({})

const recipientIsNew = async (endpointConfig, recipient) => {
  if (!isRecipientValid(recipient)) return false
  const api = apiForEndpointConfig(RippleAPI, endpointConfig)
  try {
    await api.connect()
    try {
      await api.getAccountInfo(recipient)
      return false
    } catch (e) {
      if (e.message !== 'actNotFound') {
        throw e
      }
      return true
    }
  } finally {
    api.disconnect()
  }
}

// FIXME this could be cleaner
const remapError = error => {
  const msg = error.message

  if (msg.includes('Unable to resolve host') || msg.includes('Network is down')) {
    return new NetworkDown()
  }

  return error
}

const cacheRecipientsNew = {}
const cachedRecipientIsNew = (endpointConfig, recipient) => {
  if (recipient in cacheRecipientsNew) return cacheRecipientsNew[recipient]
  cacheRecipientsNew[recipient] = recipientIsNew(endpointConfig, recipient)
  return cacheRecipientsNew[recipient]
}

export const currencyBridge: CurrencyBridge = {
  scanAccountsOnDevice: (currency, deviceId) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }

      async function main() {
        const api = apiForEndpointConfig(RippleAPI)
        try {
          await api.connect()
          const serverInfo = await getServerInfo()
          const ledgers = serverInfo.completeLedgers.split('-')
          const minLedgerVersion = Number(ledgers[0])
          const maxLedgerVersion = Number(ledgers[1])

          const derivationModes = getDerivationModesForCurrency(currency)
          for (const derivationMode of derivationModes) {
            const derivationScheme = getDerivationScheme({
              derivationMode,
              currency,
            })
            const stopAt = isIterableDerivationMode(derivationMode) ? 255 : 1
            for (let index = 0; index < stopAt; index++) {
              if (!derivationModeSupportsIndex(derivationMode, index)) continue
              const freshAddressPath = runDerivationScheme(derivationScheme, currency, {
                account: index,
              })

              const { address } = await getAddress
                .send({
                  derivationMode,
                  currencyId: currency.id,
                  devicePath: deviceId,
                  path: freshAddressPath,
                })
                .toPromise()

              if (finished) return

              const accountId = `ripplejs:2:${currency.id}:${address}:${derivationMode}`

              let info
              try {
                info = await api.getAccountInfo(address)
              } catch (e) {
                if (e.message !== 'actNotFound') {
                  throw e
                }
              }

              // fresh address is address. ripple never changes.
              const freshAddress = address

              if (!info) {
                // account does not exist in Ripple server
                // we are generating a new account locally
                if (derivationMode === '') {
                  o.next({
                    type: 'Account',
                    id: accountId,
                    seedIdentifier: freshAddress,
                    derivationMode,
                    name: getNewAccountPlaceholderName({
                      currency,
                      index,
                      derivationMode,
                    }),
                    freshAddress,
                    freshAddressPath,
                    freshAddresses: [{ address: freshAddress, derivationPath: freshAddressPath }],
                    balance: BigNumber(0),
                    blockHeight: maxLedgerVersion,
                    index,
                    currency,
                    operations: [],
                    pendingOperations: [],
                    unit: currency.units[0],
                    archived: false,
                    lastSyncDate: new Date(),
                  })
                }
                break
              }

              if (finished) return
              const balance = parseAPIValue(info.xrpBalance)
              invariant(
                !balance.isNaN() && balance.isFinite(),
                `Ripple: invalid balance=${balance.toString()} for address ${address}`,
              )

              const transactions = await api.getTransactions(address, {
                minLedgerVersion,
                maxLedgerVersion,
                types: ['payment'],
              })
              if (finished) return

              const account: $Exact<Account> = {
                type: 'Account',
                id: accountId,
                seedIdentifier: freshAddress,
                derivationMode,
                name: getAccountPlaceholderName({
                  currency,
                  index,
                  derivationMode,
                }),
                freshAddress,
                freshAddressPath,
                freshAddresses: [{ address: freshAddress, derivationPath: freshAddressPath }],
                balance,
                blockHeight: maxLedgerVersion,
                index,
                currency,
                operations: [],
                pendingOperations: [],
                unit: currency.units[0],
                lastSyncDate: new Date(),
              }
              account.operations = transactions.map(txToOperation(account)).filter(Boolean)
              o.next(account)
            }
          }
          o.complete()
        } catch (e) {
          o.error(e)
        } finally {
          api.disconnect()
        }
      }

      main()

      return unsubscribe
    }),
}

export const accountBridge: AccountBridge<Transaction> = {
  startSync: ({
    endpointConfig,
    freshAddress,
    blockHeight,
    operations: { length: currentOpsLength },
  }) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }

      async function main() {
        const api = apiForEndpointConfig(RippleAPI, endpointConfig)
        try {
          await api.connect()
          if (finished) return
          const serverInfo = await getServerInfo(endpointConfig)
          if (finished) return
          const ledgers = serverInfo.completeLedgers.split('-')
          const minLedgerVersion = Number(ledgers[0])
          const maxLedgerVersion = Number(ledgers[1])

          let info
          try {
            info = await api.getAccountInfo(freshAddress)
          } catch (e) {
            if (e.message !== 'actNotFound') {
              throw e
            }
          }
          if (finished) return

          if (!info) {
            // account does not exist, we have nothing to sync but to update the last sync date
            o.next(a => ({
              ...a,
              lastSyncDate: new Date(),
            }))
            o.complete()
            return
          }

          const balance = parseAPIValue(info.xrpBalance)
          invariant(
            !balance.isNaN() && balance.isFinite(),
            `Ripple: invalid balance=${balance.toString()} for address ${freshAddress}`,
          )

          const transactions = await api.getTransactions(freshAddress, {
            minLedgerVersion: Math.max(
              currentOpsLength === 0 ? 0 : blockHeight, // if there is no ops, it might be after a clear and we prefer to pull from the oldest possible history
              minLedgerVersion,
            ),
            maxLedgerVersion,
            types: ['payment'],
          })

          if (finished) return

          o.next(a => {
            const newOps = transactions.map(txToOperation(a))
            const operations = mergeOps(a.operations, newOps)
            const [last] = operations
            const pendingOperations = a.pendingOperations.filter(
              oo =>
                !operations.some(op => oo.hash === op.hash) &&
                last &&
                last.transactionSequenceNumber &&
                oo.transactionSequenceNumber &&
                oo.transactionSequenceNumber > last.transactionSequenceNumber,
            )
            return {
              ...a,
              balance,
              operations,
              pendingOperations,
              blockHeight: maxLedgerVersion,
              lastSyncDate: new Date(),
            }
          })

          o.complete()
        } catch (e) {
          o.error(remapError(e))
        } finally {
          api.disconnect()
        }
      }

      main()

      return unsubscribe
    }),

  pullMoreOperations: () => Promise.resolve(a => a), // FIXME not implemented

  checkValidRecipient,

  getRecipientWarning: () => Promise.resolve(null),

  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: '',
    fee: null,
    tag: undefined,
    networkInfo: null,
    feeCustomUnit: null,
  }),

  fetchTransactionNetworkInfo: async account => {
    const api = apiForEndpointConfig(RippleAPI, account.endpointConfig)
    try {
      await api.connect()
      const info = await api.getServerInfo()
      const serverFee = parseAPIValue(info.validatedLedger.baseFeeXRP)
      return {
        serverFee,
      }
    } catch (e) {
      throw remapError(e)
    } finally {
      api.disconnect()
    }
  },

  getTransactionNetworkInfo: (account, transaction) => transaction.networkInfo,

  applyTransactionNetworkInfo: (account, transaction, networkInfo) => ({
    ...transaction,
    networkInfo,
    fee: transaction.fee || networkInfo.serverFee,
  }),

  editTransactionAmount: (account, t, amount) => ({
    ...t,
    amount,
  }),

  getTransactionAmount: (a, t) => t.amount,

  editTransactionRecipient: (account, t, recipient) =>
    // TODO add back the same code as in desktop
    ({
      ...t,
      recipient,
    }),

  getTransactionRecipient: (a, t) => t.recipient,

  editTransactionExtra: (a, t, field, value) => {
    switch (field) {
      case 'fee':
        invariant(
          !value || BigNumber.isBigNumber(value),
          "editTransactionExtra(a,t,'fee',value): BigNumber value expected",
        )
        return { ...t, fee: value }

      case 'tag':
        if (!value) {
          return { ...t, tag: undefined }
        }
        invariant(
          typeof value === 'number',
          "editTransactionExtra(a,t,'tag',value): number value expected",
        )
        return { ...t, tag: value }

      case 'feeCustomUnit':
        invariant(value, "editTransactionExtra(a,t,'feeCustomUnit',value): value is expected")
        return { ...t, feeCustomUnit: value }

      default:
        return t
    }
  },

  getTransactionExtra: (a, t, field) => {
    switch (field) {
      case 'fee':
        return t.fee

      case 'tag':
        return t.tag

      case 'feeCustomUnit':
        return t.feeCustomUnit

      default:
        return undefined
    }
  },

  checkValidTransaction: async (a, t) => {
    if (!t.fee) throw new FeeNotLoaded()
    const r = await getServerInfo(a.endpointConfig)
    const reserveBaseXRP = parseAPIValue(r.validatedLedger.reserveBaseXRP)
    if (t.recipient) {
      if (await cachedRecipientIsNew(a.endpointConfig, t.recipient)) {
        if (t.amount.lt(reserveBaseXRP)) {
          const f = formatAPICurrencyXRP(reserveBaseXRP)
          throw new NotEnoughBalanceBecauseDestinationNotCreated('', {
            minimalAmount: `${f.currency} ${BigNumber(f.value).toFixed()}`,
          })
        }
      }
    }
    if (
      t.amount
        .plus(t.fee || 0)
        .plus(reserveBaseXRP)
        .isLessThanOrEqualTo(a.balance)
    ) {
      return null
    }
    throw new NotEnoughBalance()
  },

  getTotalSpent: (a, t) => Promise.resolve(t.amount.plus(t.fee || 0)),

  getMaxAmount: (a, t) => Promise.resolve(a.balance.minus(t.fee || 0)),

  signAndBroadcast: (a, t, deviceId) =>
    Observable.create(o => {
      delete cacheRecipientsNew[t.recipient]
      let cancelled = false
      const isCancelled = () => cancelled
      const onSigned = () => {
        o.next({ type: 'signed' })
      }
      const onOperationBroadcasted = operation => {
        o.next({ type: 'broadcasted', operation })
      }
      signAndBroadcast({
        a,
        t,
        deviceId,
        isCancelled,
        onSigned,
        onOperationBroadcasted,
      }).then(
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

  getDefaultEndpointConfig: () => defaultEndpoint,

  validateEndpointConfig: async endpointConfig => {
    const api = apiForEndpointConfig(RippleAPI, endpointConfig)
    await api.connect()
  },

  prepareTransaction: (a, t) => Promise.resolve(t),
}
