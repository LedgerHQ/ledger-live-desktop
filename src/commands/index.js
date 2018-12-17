// @flow

import invariant from 'invariant'
import type { Command } from 'helpers/ipc'

import debugAppInfosForCurrency from 'commands/debugAppInfosForCurrency'
import firmwareCheckId from 'commands/firmwareCheckId'
import firmwareMain from 'commands/firmwareMain'
import firmwareRepair from 'commands/firmwareRepair'
import getAddress from 'commands/getAddress'
import getDeviceInfo from 'commands/getDeviceInfo'
import getCurrentFirmware from 'commands/getCurrentFirmware'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import getMemInfo from 'commands/getMemInfo'
import installApp from 'commands/installApp'
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
import signTransaction from 'commands/signTransaction'
import testApdu from 'commands/testApdu'
import testCrash from 'commands/testCrash'
import testInterval from 'commands/testInterval'
import uninstallApp from 'commands/uninstallApp'

const all: Array<Command<any, any>> = [
  debugAppInfosForCurrency,
  firmwareCheckId,
  firmwareMain,
  firmwareRepair,
  getAddress,
  getDeviceInfo,
  getCurrentFirmware,
  getIsGenuine,
  getLatestFirmwareForDevice,
  getMemInfo,
  installApp,
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
  signTransaction,
  testApdu,
  testCrash,
  testInterval,
  uninstallApp,
]

export const commandsById = {}

all.forEach(cmd => {
  invariant(!all.some(c => c !== cmd && c.id === cmd.id), `duplicate command '${cmd.id}'`)
  commandsById[cmd.id] = cmd
})

export default all
