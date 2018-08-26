// @flow
import Str from '@ledgerhq/hw-app-str'
import type Transport from '@ledgerhq/hw-transport'
import { getServer } from 'api/Stellar'
import { Memo, Operation, Keypair, Asset, TransactionBuilder, xdr } from 'stellar-sdk'
import { StellarNotEnoughToCreateAccount } from 'config/errors'

export default async (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  transaction: Object,
) => {
  const server = getServer()
  const account = await server.loadAccount(transaction.freshAddress)
  let creatingAccount = false

  try {
    await server.loadAccount(transaction.destination)
  } catch (err) {
    creatingAccount = true
  }

  let tx = new TransactionBuilder(account)

  if (creatingAccount) {
    if (transaction.amount < 1) {
      throw new StellarNotEnoughToCreateAccount()
    }
    tx.addOperation(
      Operation.createAccount({
        destination: transaction.destination,
        startingBalance: transaction.amount,
      }),
    )
  } else {
    tx.addOperation(
      Operation.payment({
        destination: transaction.destination,
        asset: Asset.native(),
        amount: transaction.amount,
      }),
    )
  }
  if (transaction.memo) {
    // TODO implement other types of memo
    switch (transaction.memoType) {
      case 'MEMO_TEXT':
        tx.addMemo(Memo.text(transaction.memo))
        break
      case 'MEMO_ID':
        tx.addMemo(Memo.id(transaction.memo))
        break
      case 'MEMO_HASH':
        tx.addMemo(Memo.hash(transaction.memo))
        break
      case 'MEMO_RETURN':
        tx.addMemo(Memo.return(transaction.memo))
        break
      default:
      // Do nothing
    }
  }

  tx = tx.build()

  const str = new Str(transport)
  const sig = await str.signTransaction(path, tx.signatureBase())
  const hint = Keypair.fromPublicKey(transaction.freshAddress).signatureHint()
  const decorated = new xdr.DecoratedSignature({ signature: sig.signature, hint })

  tx.signatures.push(decorated)

  return tx
    .toEnvelope()
    .toXDR()
    .toString('base64')
}
