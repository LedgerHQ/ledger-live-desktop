// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo } from 'helpers/common'

export default async function getMemInfos(transport: Transport<*>): Promise<Object> {
  const { targetId } = await getFirmwareInfo(transport) // eslint-disable-line
  return new Promise(resolve => setTimeout(() => resolve({}), 1000))
}
