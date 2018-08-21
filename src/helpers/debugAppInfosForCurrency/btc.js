// @flow

import type Transport from '@ledgerhq/hw-transport'

export default async (transport: Transport<*>) => {
  const r = await transport.send(0xe0, 0xc4, 0, 0)
  const version = `${r[2]}.${r[3]}.${r[4]}`
  return { version }
}
