// @flow

import Btc from '@ledgerhq/hw-app-btc'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'

import type Transport from '@ledgerhq/hw-transport'

import type { IPCSend } from 'types/electron'
import { getWalletIdentifier } from '../scanAccountsOnDevice'

type BitcoinLikeTransaction = {
  amount: number,
  feePerByte: number,
  recipient: string,
}

export default async function signAndBroadcastTransactionBTCLike(
  send: IPCSend,
  {
    account,
    transaction,
    deviceId, // which is in fact `devicePath`
  }: {
    account: AccountRaw,
    transaction: BitcoinLikeTransaction,
    deviceId: string,
  },
) {
  try {
    // TODO: investigate why importing it on file scope causes trouble
    const core = require('init-ledger-core')()

    // instanciate app on device
    const transport: Transport<*> = await CommNodeHid.open(deviceId)
    const hwApp = new Btc(transport)

    const WALLET_IDENTIFIER = await getWalletIdentifier({
      hwApp,
      isSegwit: account.isSegwit,
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
    const signedTransaction = await core.signTransaction(hwApp, builded)

    const txHash = await njsAccount
      .asBitcoinLikeAccount()
      .broadcastRawTransaction(signedTransaction)

    send('accounts.signAndBroadcastTransactionBTCLike.success', txHash)
  } catch (err) {
    send('accounts.signAndBroadcastTransactionBTCLike.fail', err)
  }
}
