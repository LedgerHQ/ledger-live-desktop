// @flow

import Eth from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'

export default async (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  { verify = false }: { verify: boolean },
) => {
  const eth = new Eth(transport)
  const { address, publicKey } = await eth.getAddress(path, verify)
  return { path, address, publicKey }
}
