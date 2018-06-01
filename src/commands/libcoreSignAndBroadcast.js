// @flow

import type { AccountRaw, OperationRaw } from '@ledgerhq/live-common/lib/types'
import Btc from '@ledgerhq/hw-app-btc'
import { fromPromise } from 'rxjs/observable/fromPromise'
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

type Result = $Exact<OperationRaw>

const cmd: Command<Input, Result> = createCommand(
  'libcoreSignAndBroadcast',
  ({ account, transaction, deviceId }) =>
    fromPromise(
      withDevice(deviceId)(transport =>
        withLibcore(async core => {
          const hwApp = new Btc(transport)

          const WALLET_IDENTIFIER = await getWalletIdentifier({
            hwApp,
            isSegwit: !!account.isSegwit,
            currencyId: account.currencyId,
            devicePath: deviceId,
          })

          const njsWallet = await core.getWallet(WALLET_IDENTIFIER)
          const njsAccount = await njsWallet.getAccount(account.index)
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
          const sigHashType = core.helpers.bytesToHex(
            njsWalletCurrency.bitcoinLikeNetworkParameters.SigHash,
          )

          const currency = getCryptoCurrencyById(account.currencyId)
          const signedTransaction = await core.signTransaction({
            hwApp,
            transaction: builded,
            sigHashType: `0x${sigHashType}`,
            supportsSegwit: !!currency.supportsSegwit,
            isSegwit: account.isSegwit,
          })

          const txHash = await njsAccount
            .asBitcoinLikeAccount()
            .broadcastRawTransaction(signedTransaction)

          // optimistic operation
          return {
            id: txHash,
            hash: txHash,
            type: 'OUT',
            value: amount,
            blockHash: null,
            blockHeight: null,
            senders: [account.freshAddress],
            recipients: [transaction.recipient],
            accountId: account.id,
            date: new Date().toISOString(),
          }
        }),
      ),
    ),
)

export default cmd
