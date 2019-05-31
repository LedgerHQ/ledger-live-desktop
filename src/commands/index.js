// @flow

import invariant from 'invariant'
import type { Command } from 'helpers/ipc'

import appAndVersionPolling from 'commands/appAndVersionPolling'
import autoUpdate from 'commands/autoUpdate'
import firmwareMain from 'commands/firmwareMain'
import firmwarePrepare from 'commands/firmwarePrepare'
import firmwareRepair from 'commands/firmwareRepair'
import flushDevice from 'commands/flushDevice'
import getAddress from 'commands/getAddress'
import getAppAndVersion from 'commands/getAppAndVersion'
import getDeviceInfo from 'commands/getDeviceInfo'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installApp from 'commands/installApp'
import killInternalProcess from 'commands/killInternalProcess'
import libcoreGetFees from 'commands/libcoreGetFees'
import libcoreGetVersion from 'commands/libcoreGetVersion'
import libcoreReset from 'commands/libcoreReset'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreScanFromXPUB from 'commands/libcoreScanFromXPUB'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreValidAddress from 'commands/libcoreValidAddress'
import listenDevices from 'commands/listenDevices'
import ping from 'commands/ping'
import quitAndInstallElectronUpdate from 'commands/quitAndInstallElectronUpdate'
import signTransaction from 'commands/signTransaction'
import testApdu from 'commands/testApdu'
import testCrash from 'commands/testCrash'
import testInterval from 'commands/testInterval'
import uninstallApp from 'commands/uninstallApp'

const all: Array<Command<any, any>> = [
  appAndVersionPolling,
  autoUpdate,
  firmwareMain,
  firmwarePrepare,
  firmwareRepair,
  flushDevice,
  getAddress,
  getAppAndVersion,
  getDeviceInfo,
  getIsGenuine,
  getLatestFirmwareForDevice,
  installApp,
  killInternalProcess,
  libcoreGetFees,
  libcoreGetVersion,
  libcoreReset,
  libcoreScanAccounts,
  libcoreScanFromXPUB,
  libcoreSignAndBroadcast,
  libcoreSyncAccount,
  libcoreValidAddress,
  listenDevices,
  ping,
  quitAndInstallElectronUpdate,
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
