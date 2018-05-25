// @flow

import Btc from '@ledgerhq/hw-app-btc'
import type Transport from '@ledgerhq/hw-transport'

export default async (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  {
    segwit = true,
    verify = false,
  }: {
    segwit?: boolean,
    verify?: boolean,
  },
) => {
  const btc = new Btc(transport)
  const { bitcoinAddress, publicKey } = await btc.getWalletPublicKey(path, verify, segwit)
  return { address: bitcoinAddress, path, publicKey }
}
