// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo } from 'helpers/common'

type Result = boolean

export default async (transport: Transport<*>): Promise<Result> => {
  const { targetId, seVersion } = await getFirmwareInfo(transport)
  if (targetId && seVersion) {
    return true
  }

  return false
}
