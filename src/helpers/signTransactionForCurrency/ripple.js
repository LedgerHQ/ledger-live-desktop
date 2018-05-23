// @flow
import Xrp from '@ledgerhq/hw-app-xrp'
import type Transport from '@ledgerhq/hw-transport'
import BinaryCodec from 'ripple-binary-codec'

export default async (transport: Transport<*>, currencyId: string, path: string, tx: Object) => {
  tx = { ...tx }
  const xrp = new Xrp(transport)
  const { publicKey } = await xrp.getAddress(path)
  tx.SigningPubKey = publicKey.toUpperCase()
  const rawTxHex = BinaryCodec.encode(tx).toUpperCase()
  tx.TxnSignature = (await xrp.signTransaction(path, rawTxHex)).toUpperCase()
  return BinaryCodec.encode(tx).toUpperCase()
}
