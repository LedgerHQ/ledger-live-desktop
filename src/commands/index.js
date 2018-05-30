// @flow

import type { Command } from 'helpers/ipc'

import getAddress from 'commands/getAddress'
import getDeviceInfo from 'commands/getDeviceInfo'
import getFirmwareInfo from 'commands/getFirmwareInfo'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import getMemInfo from 'commands/getMemInfo'
import installApp from 'commands/installApp'
import installFinalFirmware from 'commands/installFinalFirmware'
import installMcu from 'commands/installMcu'
import installOsuFirmware from 'commands/installOsuFirmware'
import isCurrencyAppOpened from 'commands/isCurrencyAppOpened'
import libcoreGetVersion from 'commands/libcoreGetVersion'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import listApps from 'commands/listApps'
import listenDevices from 'commands/listenDevices'
import signTransaction from 'commands/signTransaction'
import testApdu from 'commands/testApdu'
import testCrash from 'commands/testCrash'
import testInterval from 'commands/testInterval'
import uninstallApp from 'commands/uninstallApp'

const all: Array<Command<any, any>> = [
  getAddress,
  getDeviceInfo,
  getFirmwareInfo,
  getIsGenuine,
  getLatestFirmwareForDevice,
  getMemInfo,
  installApp,
  installFinalFirmware,
  installMcu,
  installOsuFirmware,
  isCurrencyAppOpened,
  libcoreGetVersion,
  libcoreScanAccounts,
  libcoreSignAndBroadcast,
  libcoreSyncAccount,
  listApps,
  listenDevices,
  signTransaction,
  testApdu,
  testCrash,
  testInterval,
  uninstallApp,
]

all.forEach(cmd => {
  if (all.some(c => c !== cmd && c.id === cmd.id)) {
    throw new Error(`duplicate command '${cmd.id}'`)
  }
})

export default all
