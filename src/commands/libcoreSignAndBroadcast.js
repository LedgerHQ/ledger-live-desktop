// @flow

import logger from 'logger'
import { BigNumber } from 'bignumber.js'
import { StatusCodes } from '@ledgerhq/hw-transport'
import Btc from '@ledgerhq/hw-app-btc'
import Eth from '@ledgerhq/hw-app-eth'
import { Observable } from 'rxjs'
import {
  isSegwitDerivationMode,
  getDerivationScheme,
  runDerivationScheme,
} from '@ledgerhq/live-common/lib/derivation'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import type { OperationRaw, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
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
import EthereumTx from 'ethereumjs-tx'

type BitcoinLikeTransaction = {
  amount: string,
  feePerByte: string,
  recipient: string,
}

type Input = {
  accountId: string,
  blockHeight: number,
  currencyId: string,
  derivationMode: string,
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

async function signEthTransaction({
  path,
  hwApp,
  transaction,
}: {
  path: string,
  hwApp: Eth,
  transaction: *,
}) {
  const serialized = transaction.serialize()
  const signed = await hwApp.signTransaction(path, Buffer.from(serialized).toString('hex'))
  return signed
}

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
  derivationMode: string,
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
  }
  const rawInputs = transaction.getInputs()

  const hasExtraData = currency.id === 'zcash'

  const inputs = await Promise.all(
    rawInputs.map(async input => {
      const rawPreviousTransaction = await input.getPreviousTransaction()
      const hexPreviousTransaction = Buffer.from(rawPreviousTransaction).toString('hex')
      const previousTransaction = hwApp.splitTransaction(
        hexPreviousTransaction,
        currency.supportsSegwit,
        hasTimestamp,
        hasExtraData,
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
  derivationMode: string,
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

  const njsWalletCurrency = njsWallet.getCurrency()
  const amount = bigNumberToLibcoreAmount(core, njsWalletCurrency, BigNumber(transaction.amount))
  let transactionBuilder

  if (currency.family === 'ethereum') {
    const ethereumLikeAccount = njsAccount.asEthereumLikeAccount()
    transactionBuilder = ethereumLikeAccount.buildTransaction()
    transactionBuilder.setGasPrice(
      bigNumberToLibcoreAmount(core, njsWalletCurrency, BigNumber(transaction.gasPrice)),
    )
    transactionBuilder.setGasLimit(
      bigNumberToLibcoreAmount(core, njsWalletCurrency, BigNumber(transaction.gasLimit)),
    )
    transactionBuilder.setInputData(Buffer.from([0]))
  } else {
    const bitcoinLikeAccount = njsAccount.asBitcoinLikeAccount()
    const fees = bigNumberToLibcoreAmount(
      core,
      njsWalletCurrency,
      BigNumber(transaction.feePerByte),
    )
    transactionBuilder = bitcoinLikeAccount.buildTransaction()
    // TODO: don't use hardcoded value for sequence (and first also maybe)
    transactionBuilder.pickInputs(0, 0xffffff)
    transactionBuilder.setFeesPerByte(fees)
  }

  // TODO: check if is valid address. if not, it will fail silently on invalid
  transactionBuilder.sendToAddress(amount, transaction.recipient)

  const builded = await transactionBuilder.build()

  if (isCancelled()) return

  let signedTransaction

  if (currency.family === 'ethereum') {
    const derivationScheme = getDerivationScheme({ currency, derivationMode })
    const accountPath = runDerivationScheme(derivationScheme, currency, { account: index })
    signedTransaction = await withDevice(deviceId)(async transport =>
      signEthTransaction({
        path: accountPath,
        hwApp: new Eth(transport),
        transaction: builded,
      }),
    )

    const ethTxData = {
      nonce: builded.getNonce(),
      gasPrice: `0x${BigNumber(builded.getGasPrice().toString()).toString(16)}`,
      gasLimit: `0x${BigNumber(builded.getGasLimit().toString()).toString(16)}`,
      to: builded.getReceiver().toEIP55(),
      value: `0x${BigNumber(builded.getValue().toString()).toString(16)}`,
      chainId: 1, // TODO: hard coded for maintnet
      v: Buffer.from(signedTransaction.v, 'hex'),
      r: Buffer.from(signedTransaction.r, 'hex'),
      s: Buffer.from(signedTransaction.s, 'hex'),
    }

    const tx = new EthereumTx(ethTxData)
    signedTransaction = tx.serialize()
  } else {
    const sigHashType = Buffer.from(
      njsWalletCurrency.bitcoinLikeNetworkParameters.SigHash,
    ).toString('hex')

    const hasTimestamp = !!njsWalletCurrency.bitcoinLikeNetworkParameters.UsesTimestampedTransaction
    // TODO: const timestampDelay = njsWalletCurrency.bitcoinLikeNetworkParameters.TimestampDelay

    signedTransaction = await withDevice(deviceId)(async transport =>
      signTransaction({
        hwApp: new Btc(transport),
        currency,
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
  }

  if (!signedTransaction || isCancelled() || !njsAccount) return
  onSigned()

  if (currency.family === 'bitcoin') {
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
    onOperationBroadcasted({
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
    })
  } else {
    const txHash = await njsAccount
      .asEthereumLikeAccount()
      .broadcastRawTransaction(Array.from(Buffer.from(signedTransaction, 'hex')))

    onOperationBroadcasted({
      id: `${accountId}-${txHash}-OUT`,
      hash: txHash,
      type: 'OUT',
      value: amount,
      fee: BigNumber(builded.getGasPrice().toString())
        .times(BigNumber(builded.getGasLimit().toString()))
        .toNumber(),
      blockHeight: null,
      blockHash: null,
      accountId,
      senders: [seedIdentifier],
      recipients: [transaction.recipient],
      transactionSequenceNumber: BigNumber(builded.getNonce()).toNumber(),
      date: new Date(),
    })
  }
}

export default cmd
