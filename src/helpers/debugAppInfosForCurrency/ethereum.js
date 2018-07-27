// @flow

import Eth from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'

export default async (transport: Transport<*>) => {
  const eth = new Eth(transport)
  const { version } = await eth.getAppConfiguration()
  return { version }
}
