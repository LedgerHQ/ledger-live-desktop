// @flow

import type { AccountRaw, OperationRaw } from '@ledgerhq/live-common/lib/types'
import Btc from '@ledgerhq/hw-app-btc'
import { Observable } from 'rxjs'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import { withDevice } from 'helpers/deviceAccess'
import { getWalletIdentifier } from 'helpers/libcore'

type BitcoinLikeTransaction = {
  amount: number,
  feePerByte: number,
  recipient: string,
}

type Input = {
  account: AccountRaw,
  transaction: BitcoinLikeTransaction,
  deviceId: string,
}

type Result = { type: 'signed' } | { type: 'broadcasted', operation: OperationRaw }

const cmd: Command<Input, Result> = createCommand(
  'libcoreSignAndBroadcast',
  ({ account, transaction, deviceId }) =>
    Observable.create(o => {
      let unsubscribed = false
      const isCancelled = () => unsubscribed
      withLibcore(core =>
        doSignAndBroadcast({
          account,
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

export async function doSignAndBroadcast({
  account,
  transaction,
  deviceId,
  core,
  isCancelled,
  onSigned,
  onOperationBroadcasted,
}: {
  account: AccountRaw,
  transaction: BitcoinLikeTransaction,
  deviceId: string,
  core: *,
  isCancelled: () => boolean,
  onSigned: () => void,
  onOperationBroadcasted: (optimisticOp: $Exact<OperationRaw>) => void,
}): Promise<void> {
  let njsAccount

  const signedTransaction: ?string = await withDevice(deviceId)(async transport => {
    const hwApp = new Btc(transport)

    const WALLET_IDENTIFIER = await getWalletIdentifier({
      hwApp,
      isSegwit: !!account.isSegwit,
      currencyId: account.currencyId,
      devicePath: deviceId,
    })

    const njsWallet = await core.getWallet(WALLET_IDENTIFIER)
    if (isCancelled()) return null
    njsAccount = await njsWallet.getAccount(account.index)
    if (isCancelled()) return null
    const bitcoinLikeAccount = njsAccount.asBitcoinLikeAccount()
    const njsWalletCurrency = njsWallet.getCurrency()
    const amount = core.createAmount(njsWalletCurrency, transaction.amount)
    const fees = core.createAmount(njsWalletCurrency, transaction.feePerByte)
    const transactionBuilder = bitcoinLikeAccount.buildTransaction()

    // TODO: check if is valid address. if not, it will fail silently on invalid

    transactionBuilder.sendToAddress(amount, transaction.recipient)
    // TODO: don't use hardcoded value for sequence (and first also maybe)
    transactionBuilder.pickInputs(0, 0xffffff)
    transactionBuilder.setFeesPerByte(fees)

    const builded = await transactionBuilder.build()
    if (isCancelled()) return null
    const sigHashType = core.helpers.bytesToHex(
      njsWalletCurrency.bitcoinLikeNetworkParameters.SigHash,
    )

    const hasTimestamp = njsWalletCurrency.bitcoinLikeNetworkParameters.UsesTimestampedTransaction
    // TODO: const timestampDelay = njsWalletCurrency.bitcoinLikeNetworkParameters.TimestampDelay

    const currency = getCryptoCurrencyById(account.currencyId)

    return core.signTransaction({
      hwApp,
      transaction: builded,
      sigHashType: parseInt(sigHashType, 16).toString(),
      supportsSegwit: !!currency.supportsSegwit,
      isSegwit: account.isSegwit,
      hasTimestamp,
    })
  })

  if (!signedTransaction || isCancelled() || !njsAccount) return
  onSigned()

  const txHash = await njsAccount.asBitcoinLikeAccount().broadcastRawTransaction(signedTransaction)
  // NB we don't check isCancelled() because the broadcast is not cancellable now!
  onOperationBroadcasted({
    id: txHash,
    hash: txHash,
    type: 'OUT',
    value: transaction.amount,
    fee: 0,
    blockHash: null,
    blockHeight: null,
    senders: [account.freshAddress],
    recipients: [transaction.recipient],
    accountId: account.id,
    date: new Date().toISOString(),
  })
}

export default cmd
