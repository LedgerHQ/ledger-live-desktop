// @flow

import type Transport from '@ledgerhq/hw-transport'

import type { IPCSend } from 'types/electron'

import { createTransportHandler, getFirmwareInfo } from './helpers'

const handler = async (transport: Transport<*>) =>
  new Promise(async resolve => {
    try {
      const { targetId, version } = await getFirmwareInfo(transport)
      const finalReady = version.endsWith('-osu')
      const mcuReady = targetId === 0x01000001
      resolve({ targetId, version, final: finalReady, mcu: mcuReady })
    } catch (err) {
      throw err
    }
  })

export default async (send: IPCSend, data: any) =>
  createTransportHandler(send, {
    action: handler,
    successResponse: 'device.getFirmwareInfoSuccess',
    errorResponse: 'device.getFirmwareInfoError',
  })(data)
