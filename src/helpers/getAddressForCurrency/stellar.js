// @flow

import Str from '@ledgerhq/hw-app-str'
import type Transport from '@ledgerhq/hw-transport'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

export default async (
  transport: Transport<*>,
  currency: CryptoCurrency,
  path: string,
  { verify = false }: *,
) => {
  // Alter the path since it deviates from the standard
  const matches = path.match(/\d+/g)
  const x = (matches && matches[2]) || '0'
  path = `44'/148'/${x}'`

  const str = new Str(transport)
  const { publicKey } = await str.getPublicKey(path, true, verify)
  return { path, address: publicKey, publicKey }
}
