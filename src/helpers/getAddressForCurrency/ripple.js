// @flow

import Xrp from '@ledgerhq/hw-app-xrp'
import type Transport from '@ledgerhq/hw-transport'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

export default async (
  transport: Transport<*>,
  currency: CryptoCurrency,
  path: string,
  { verify = false }: *,
) => {
  const xrp = new Xrp(transport)
  const { address, publicKey } = await xrp.getAddress(path, verify)
  return { path, address, publicKey }
}
