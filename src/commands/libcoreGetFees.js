// @flow

import { Observable } from 'rxjs'
import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import * as accountIdHelper from 'helpers/accountId'
import { isValidAddress } from 'helpers/libcore'
import createCustomErrorClass from 'helpers/createCustomErrorClass'

const InvalidAddress = createCustomErrorClass('InvalidAddress')

type BitcoinLikeTransaction = {
  // TODO we rename this Transaction concept into transactionInput
  amount: number,
  feePerByte: number,
  recipient: string,
}

type Input = {
  accountId: string,
  accountIndex: number,
  transaction: BitcoinLikeTransaction,
}

type Result = { totalFees: number }

const cmd: Command<Input, Result> = createCommand(
  'libcoreGetFees',
  ({ accountId, accountIndex, transaction }) =>
    Observable.create(o => {
      let unsubscribed = false
      const isCancelled = () => unsubscribed

      withLibcore(async core => {
        const { walletName } = accountIdHelper.decode(accountId)
        const njsWallet = await core.getPoolInstance().getWallet(walletName)
        if (isCancelled()) return
        const njsAccount = await njsWallet.getAccount(accountIndex)
        if (isCancelled()) return
        const bitcoinLikeAccount = njsAccount.asBitcoinLikeAccount()
        const njsWalletCurrency = njsWallet.getCurrency()
        const amount = new core.NJSAmount(njsWalletCurrency, transaction.amount).fromLong(
          njsWalletCurrency,
          transaction.amount,
        )
        const feesPerByte = new core.NJSAmount(njsWalletCurrency, transaction.feePerByte).fromLong(
          njsWalletCurrency,
          transaction.feePerByte,
        )
        const transactionBuilder = bitcoinLikeAccount.buildTransaction()
        if (!isValidAddress(core, njsWalletCurrency, transaction.recipient)) {
          // FIXME this is a bug in libcore. later it will probably check this and we can remove this check
          throw new InvalidAddress()
        }
        transactionBuilder.sendToAddress(amount, transaction.recipient)
        transactionBuilder.pickInputs(0, 0xffffff)
        transactionBuilder.setFeesPerByte(feesPerByte)
        const builded = await transactionBuilder.build()
        const totalFees = builded.getFees().toLong()
        o.next({ totalFees })
      }).then(() => o.complete(), e => o.error(e))

      return () => {
        unsubscribed = true
      }
    }),
)

export default cmd
