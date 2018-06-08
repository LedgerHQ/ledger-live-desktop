// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo } from 'helpers/common'

type Result = boolean

export default async (transport: Transport<*>): Promise<Result> => {
  try {
    const { targetId, version } = await getFirmwareInfo(transport)
    if (targetId && version) {
      return true
    }

    return false
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
