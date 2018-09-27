// @flow

import invariant from 'invariant'
import type { Command } from 'helpers/ipc'

import debugAppInfosForCurrency from 'commands/debugAppInfosForCurrency'
import getAddress from 'commands/getAddress'
import getDeviceInfo from 'commands/getDeviceInfo'
import getCurrentFirmware from 'commands/getCurrentFirmware'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import getMemInfo from 'commands/getMemInfo'
import installApp from 'commands/installApp'
import installFinalFirmware from 'commands/installFinalFirmware'
import installMcu from 'commands/installMcu'
import installOsuFirmware from 'commands/installOsuFirmware'
import isDashboardOpen from 'commands/isDashboardOpen'
import killInternalProcess from 'commands/killInternalProcess'
import libcoreGetFees from 'commands/libcoreGetFees'
import libcoreGetVersion from 'commands/libcoreGetVersion'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreScanFromXPUB from 'commands/libcoreScanFromXPUB'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreValidAddress from 'commands/libcoreValidAddress'
import listApps from 'commands/listApps'
import listAppVersions from 'commands/listAppVersions'
import listCategories from 'commands/listCategories'
import listenDevices from 'commands/listenDevices'
import ping from 'commands/ping'
import shouldFlashMcu from 'commands/shouldFlashMcu'
import signTransaction from 'commands/signTransaction'
import testApdu from 'commands/testApdu'
import testCrash from 'commands/testCrash'
import testInterval from 'commands/testInterval'
import uninstallApp from 'commands/uninstallApp'

const all: Array<Command<any, any>> = [
  debugAppInfosForCurrency,
  getAddress,
  getDeviceInfo,
  getCurrentFirmware,
  getIsGenuine,
  getLatestFirmwareForDevice,
  getMemInfo,
  installApp,
  installFinalFirmware,
  installMcu,
  installOsuFirmware,
  isDashboardOpen,
  killInternalProcess,
  libcoreGetFees,
  libcoreGetVersion,
  libcoreScanAccounts,
  libcoreScanFromXPUB,
  libcoreSignAndBroadcast,
  libcoreSyncAccount,
  libcoreValidAddress,
  listApps,
  listAppVersions,
  listCategories,
  listenDevices,
  ping,
  shouldFlashMcu,
  signTransaction,
  testApdu,
  testCrash,
  testInterval,
  uninstallApp,
]

all.forEach(cmd => {
  invariant(!all.some(c => c !== cmd && c.id === cmd.id), `duplicate command '${cmd.id}'`)
})

export default all
