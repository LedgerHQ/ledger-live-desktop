// @flow

import Xrp from '@ledgerhq/hw-app-xrp'
import type Transport from '@ledgerhq/hw-transport'

export default async (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  { verify = false }: { verify: boolean },
) => {
  const xrp = new Xrp(transport)
  const { address, publicKey } = await xrp.getAddress(path, verify)
  return { path, address, publicKey }
}
