// @flow

import Btc from '@ledgerhq/hw-app-btc'
import type Transport from '@ledgerhq/hw-transport'
import { getPath } from 'internals/accounts/helpers'

export default async (
  transport: Transport<*>,
  currencyId: string,
  bip32path: ?string,
  {
    segwit = true,
    verify = false,
  }: {
    segwit: boolean,
    verify: boolean,
  },
) => {
  const btc = new Btc(transport)
  const path = bip32path || getPath({ currencyId, segwit })
  const { bitcoinAddress } = await btc.getWalletPublicKey(path, verify, segwit)
  return bitcoinAddress
}
