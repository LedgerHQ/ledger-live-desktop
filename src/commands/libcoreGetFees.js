// @flow

import { Observable } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { getWalletName } from '@ledgerhq/live-common/lib/account'
import type { Account } from '@ledgerhq/live-common/lib/types'
import {
  isValidAddress,
  libcoreAmountToBigNumber,
  bigNumberToLibcoreAmount,
  getOrCreateWallet,
} from 'helpers/libcore'
import { InvalidAddress } from 'config/errors'

type BitcoinLikeTransaction = {
  // TODO we rename this Transaction concept into transactionInput
  amount: string,
  feePerByte: string,
  recipient: string,
}

type Input = {
  accountIndex: number,
  transaction: BitcoinLikeTransaction,
  currencyId: string,
  derivationMode: string,
  seedIdentifier: string,
}

export const extractGetFeesInputFromAccount = (a: Account) => {
  const currencyId = a.currency.id
  return {
    accountIndex: a.index,
    currencyId,
    derivationMode: a.derivationMode,
    seedIdentifier: a.seedIdentifier,
  }
}

type Result = { totalFees: string }

const cmd: Command<Input, Result> = createCommand(
  'libcoreGetFees',
  ({ currencyId, derivationMode, seedIdentifier, accountIndex, transaction }) =>
    Observable.create(o => {
      let unsubscribed = false
      const isCancelled = () => unsubscribed
      const currency = getCryptoCurrencyById(currencyId)

      if (currency.family === 'ethereum') {
        const { gasPrice } = transaction
        // TODO don't hardcode
        const gasLimit = BigNumber(0x5208)
        const totalFees = BigNumber(gasPrice).times(gasLimit)
        o.next({ totalFees })
        o.complete()
      } else {
        withLibcore(async core => {
          const walletName = getWalletName({
            currency,
            derivationMode,
            seedIdentifier,
          })
          const njsWallet = await getOrCreateWallet(core, walletName, {
            currency,
            derivationMode,
          })
          if (isCancelled()) return
          const njsAccount = await njsWallet.getAccount(accountIndex)
          if (isCancelled()) return

          const njsWalletCurrency = njsWallet.getCurrency()
          const bitcoinLikeAccount = njsAccount.asBitcoinLikeAccount()
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
      }

      return () => {
        unsubscribed = true
      }
    }),
)

export default cmd
