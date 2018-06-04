// @flow

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import Eth from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'
import eip55 from 'eip55'

export default async (
  transport: Transport<*>,
  currency: CryptoCurrency,
  path: string,
  { verify = false }: *,
) => {
  const eth = new Eth(transport)
  const r = await eth.getAddress(path, verify)
  const address = eip55.encode(r.address)
  return { path, address, publicKey: r.publicKey }
}
