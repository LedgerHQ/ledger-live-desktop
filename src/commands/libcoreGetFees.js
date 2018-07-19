// @flow

import { Observable } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import * as accountIdHelper from 'helpers/accountId'
import { isValidAddress, libcoreAmountToBigNumber, bigNumberToLibcoreAmount } from 'helpers/libcore'
import { createCustomErrorClass } from 'helpers/errors'

const InvalidAddress = createCustomErrorClass('InvalidAddress')

type BitcoinLikeTransaction = {
  // TODO we rename this Transaction concept into transactionInput
  amount: string,
  feePerByte: string,
  recipient: string,
}

type Input = {
  accountId: string,
  accountIndex: number,
  transaction: BitcoinLikeTransaction,
}

type Result = { totalFees: string }

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
        const amount = bigNumberToLibcoreAmount(
          core,
          njsWalletCurrency,
          BigNumber(transaction.amount),
        )
        const feesPerByte = bigNumberToLibcoreAmount(
          core,
          njsWalletCurrency,
          BigNumber(transaction.feePerByte),
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
        const totalFees = libcoreAmountToBigNumber(builded.getFees()).toString()
        o.next({ totalFees })
      }).then(() => o.complete(), e => o.error(e))

      return () => {
        unsubscribed = true
      }
    }),
)

export default cmd
