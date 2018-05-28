// @flow
import type { Command } from 'helpers/ipc'

import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'
import getDeviceInfo from 'commands/getDeviceInfo'
import getFirmwareInfo from 'commands/getFirmwareInfo'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installApp from 'commands/installApp'
import listen from './listen'

// TODO port these to commands
export { listen }

export const commands: Array<Command<any, any>> = [
  getAddress,
  signTransaction,
  getDeviceInfo,
  getFirmwareInfo,
  getIsGenuine,
  getLatestFirmwareForDevice,
  installApp,
  libcoreScanAccounts,
  libcoreSignAndBroadcast,
]
