// @flow

import logger from 'logger'
import { BigNumber } from 'bignumber.js'
import { StatusCodes } from '@ledgerhq/hw-transport'
import Btc from '@ledgerhq/hw-app-btc'
import { Observable } from 'rxjs'
import { isSegwitDerivationMode } from '@ledgerhq/live-common/lib/derivation'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import type { OperationRaw, DerivationMode, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { getWalletName } from '@ledgerhq/live-common/lib/account'
import {
  libcoreAmountToBigNumber,
  bigNumberToLibcoreAmount,
  getOrCreateWallet,
} from 'helpers/libcore'
import { UpdateYourApp } from 'config/errors'

import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import { withDevice } from 'helpers/deviceAccess'

type BitcoinLikeTransaction = {
  amount: string,
  feePerByte: string,
  recipient: string,
}

type Input = {
  accountId: string,
  blockHeight: number,
  currencyId: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
  xpub: string,
  index: number,
  transaction: BitcoinLikeTransaction,
  deviceId: string,
}

type Result = { type: 'signed' } | { type: 'broadcasted', operation: OperationRaw }

// FIXME this command should be unified with 'signTransaction' command

const cmd: Command<Input, Result> = createCommand(
  'libcoreSignAndBroadcast',
  ({
    accountId,
    blockHeight,
    currencyId,
    derivationMode,
    seedIdentifier,
    xpub,
    index,
    transaction,
    deviceId,
  }) =>
    Observable.create(o => {
      let unsubscribed = false
      const currency = getCryptoCurrencyById(currencyId)
      const isCancelled = () => unsubscribed
      withLibcore(core =>
        doSignAndBroadcast({
          accountId,
          currency,
          blockHeight,
          derivationMode,
          seedIdentifier,
          xpub,
          index,
          transaction,
          deviceId,
          core,
          isCancelled,
          onSigned: () => {
            o.next({ type: 'signed' })
          },
          onOperationBroadcasted: operation => {
            o.next({
              type: 'broadcasted',
              operation,
            })
          },
        }),
      ).then(() => o.complete(), e => o.error(e))

      return () => {
        unsubscribed = true
      }
    }),
)

async function signTransaction({
  hwApp,
  currency,
  blockHeight,
  transaction,
  derivationMode,
  sigHashType,
  hasTimestamp,
}: {
  hwApp: Btc,
  currency: CryptoCurrency,
  blockHeight: number,
  transaction: *,
  derivationMode: DerivationMode,
  sigHashType: number,
  hasTimestamp: boolean,
}) {
  const additionals = []
  let expiryHeight
  if (currency.id === 'bitcoin_cash' || currency.id === 'bitcoin_gold') additionals.push('bip143')
  if (currency.id === 'zcash') {
    expiryHeight = Buffer.from([0x00, 0x00, 0x00, 0x00])
    if (blockHeight >= 419200) {
      additionals.push('sapling')
    }
  } else if (currency.id === 'decred') {
    expiryHeight = Buffer.from([0x00, 0x00, 0x00, 0x00])
    additionals.push('decred')
  }
  const rawInputs = transaction.getInputs()

  const hasExtraData = currency.id === 'zcash'

  const inputs = await Promise.all(
    rawInputs.map(async input => {
      const rawPreviousTransaction = await input.getPreviousTransaction()
      const hexPreviousTransaction = Buffer.from(rawPreviousTransaction).toString('hex')
      const previousTransaction = hwApp.splitTransaction(
        hexPreviousTransaction,
        true, // set to true allow both segwit AND non-segwit
        hasTimestamp,
        hasExtraData,
        additionals,
      )
      const outputIndex = input.getPreviousOutputIndex()
      const sequence = input.getSequence()
      return [
        previousTransaction,
        outputIndex,
        undefined, // we don't use that TODO: document
        sequence, // 0xffffffff,
      ]
    }),
  )

  const associatedKeysets = rawInputs.map(input => {
    const derivationPaths = input.getDerivationPath()
    return derivationPaths[0].toString()
  })

  const outputs = transaction.getOutputs()

  const output = outputs.find(output => {
    const derivationPath = output.getDerivationPath()
    if (derivationPath.isNull()) {
      return false
    }
    const strDerivationPath = derivationPath.toString()
    const derivationArr = strDerivationPath.split('/')
    return derivationArr[derivationArr.length - 2] === '1'
  })

  const changePath = output ? output.getDerivationPath().toString() : undefined
  const outputScriptHex = Buffer.from(transaction.serializeOutputs()).toString('hex')
  const initialTimestamp = hasTimestamp ? transaction.getTimestamp() : undefined

  // FIXME
  // should be `transaction.getLockTime()` as soon as lock time is
  // handled by libcore (actually: it always returns a default value
  // and that caused issue with zcash (see #904))
  const lockTime = undefined

  const signedTransaction = await hwApp.createPaymentTransactionNew(
    inputs,
    associatedKeysets,
    changePath,
    outputScriptHex,
    lockTime,
    sigHashType,
    isSegwitDerivationMode(derivationMode),
    initialTimestamp,
    additionals,
    expiryHeight,
  )

  return signedTransaction
}

export async function doSignAndBroadcast({
  accountId,
  derivationMode,
  blockHeight,
  seedIdentifier,
  currency,
  xpub,
  index,
  transaction,
  deviceId,
  core,
  isCancelled,
  onSigned,
  onOperationBroadcasted,
}: {
  accountId: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
  blockHeight: number,
  currency: CryptoCurrency,
  xpub: string,
  index: number,
  transaction: BitcoinLikeTransaction,
  deviceId: string,
  core: *,
  isCancelled: () => boolean,
  onSigned: () => void,
  onOperationBroadcasted: (optimisticOp: $Exact<OperationRaw>) => void,
}): Promise<void> {
  const walletName = getWalletName({ currency, seedIdentifier, derivationMode })

  const njsWallet = await getOrCreateWallet(core, walletName, { currency, derivationMode })
  if (isCancelled()) return
  const njsAccount = await njsWallet.getAccount(index)
  if (isCancelled()) return
  const bitcoinLikeAccount = njsAccount.asBitcoinLikeAccount()
  const njsWalletCurrency = njsWallet.getCurrency()
  const amount = bigNumberToLibcoreAmount(core, njsWalletCurrency, BigNumber(transaction.amount))
  const fees = bigNumberToLibcoreAmount(core, njsWalletCurrency, BigNumber(transaction.feePerByte))
  const isPartial = false
  const transactionBuilder = bitcoinLikeAccount.buildTransaction(isPartial)

  // TODO: check if is valid address. if not, it will fail silently on invalid

  transactionBuilder.sendToAddress(amount, transaction.recipient)
  // TODO: don't use hardcoded value for sequence (and first also maybe)
  transactionBuilder.pickInputs(0, 0xffffff)
  transactionBuilder.setFeesPerByte(fees)

  const builded = await transactionBuilder.build()
  if (isCancelled()) return
  const sigHashType = Buffer.from(njsWalletCurrency.bitcoinLikeNetworkParameters.SigHash).toString(
    'hex',
  )

  const hasTimestamp = !!njsWalletCurrency.bitcoinLikeNetworkParameters.UsesTimestampedTransaction
  // TODO: const timestampDelay = njsWalletCurrency.bitcoinLikeNetworkParameters.TimestampDelay

  const signedTransaction = await withDevice(deviceId)(async transport =>
    signTransaction({
      hwApp: new Btc(transport),
      currency,
      blockHeight,
      transaction: builded,
      sigHashType: parseInt(sigHashType, 16),
      hasTimestamp,
      derivationMode,
    }),
  ).catch(e => {
    if (e && e.statusCode === StatusCodes.INCORRECT_P1_P2) {
      throw new UpdateYourApp(`UpdateYourApp ${currency.id}`, currency)
    }
    throw e
  })

  if (!signedTransaction || isCancelled() || !njsAccount) return
  onSigned()

  logger.log(signedTransaction)

  const txHash = await njsAccount
    .asBitcoinLikeAccount()
    .broadcastRawTransaction(Array.from(Buffer.from(signedTransaction, 'hex')))

  const senders = builded
    .getInputs()
    .map(input => input.getAddress())
    .filter(a => a)

  const recipients = builded
    .getOutputs()
    .map(output => output.getAddress())
    .filter(a => a)

  const fee = libcoreAmountToBigNumber(builded.getFees())

  // NB we don't check isCancelled() because the broadcast is not cancellable now!
  const op: $Exact<OperationRaw> = {
    id: `${xpub}-${txHash}-OUT`,
    hash: txHash,
    type: 'OUT',
    value: BigNumber(transaction.amount)
      .plus(fee)
      .toString(),
    fee: fee.toString(),
    blockHash: null,
    blockHeight: null,
    senders,
    recipients,
    accountId,
    date: new Date().toISOString(),
    extra: {},
  }
  onOperationBroadcasted(op)
}

export default cmd
