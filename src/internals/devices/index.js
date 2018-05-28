// @flow
import type { Command } from 'helpers/ipc'

import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'
import getDeviceInfo from 'commands/getDeviceInfo'
import getFirmwareInfo from 'commands/getFirmwareInfo'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installApp from 'commands/installApp'
import listenDevices from 'commands/listenDevices'
import uninstallApp from 'commands/uninstallApp'
import installOsuFirmware from 'commands/installOsuFirmware'
import installFinalFirmware from 'commands/installFinalFirmware'
import installMcu from 'commands/installMcu'

export const commands: Array<Command<any, any>> = [
  getAddress,
  signTransaction,
  getDeviceInfo,
  getFirmwareInfo,
  getIsGenuine,
  getLatestFirmwareForDevice,
  installApp,
  listenDevices,
  uninstallApp,
  installOsuFirmware,
  installFinalFirmware,
  installMcu,
]
