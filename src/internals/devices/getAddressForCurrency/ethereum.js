// @flow

import Eth from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'
import { getPath } from 'internals/accounts/helpers'

export default async (
  transport: Transport<*>,
  currencyId: string,
  bip32path: ?string,
  { verify = false }: { verify: boolean },
) => {
  const eth = new Eth(transport)
  const path = bip32path || getPath({ currencyId })
  const { address } = await eth.getAddress(path, verify)
  return address
}
