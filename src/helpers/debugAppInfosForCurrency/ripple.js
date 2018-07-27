// @flow

import Xrp from '@ledgerhq/hw-app-xrp'
import type Transport from '@ledgerhq/hw-transport'

export default async (transport: Transport<*>) => {
  const xrp = new Xrp(transport)
  const { version } = await xrp.getAppConfiguration()
  return { version }
}
