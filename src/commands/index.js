// @flow

import type { Command } from 'helpers/ipc'

import getMemInfo from 'commands/getMemInfo'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
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
import listApps from 'commands/listApps'
import testApdu from 'commands/testApdu'
import testInterval from 'commands/testInterval'
import testCrash from 'commands/testCrash'

const all: Array<Command<any, any>> = [
  getMemInfo,
  libcoreScanAccounts,
  libcoreSignAndBroadcast,
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
  listApps,
  testApdu,
  testInterval,
  testCrash,
]

all.forEach(cmd => {
  if (all.some(c => c !== cmd && c.id === cmd.id)) {
    throw new Error(`duplicate command '${cmd.id}'`)
  }
})

export default all
