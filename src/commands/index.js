// @flow

import invariant from 'invariant'
import type { Command } from 'helpers/ipc'

import getAppAndVersion from 'commands/getAppAndVersion'
import autoUpdate from 'commands/autoUpdate'
import firmwarePrepare from 'commands/firmwarePrepare'
import firmwareMain from 'commands/firmwareMain'
import firmwareRepair from 'commands/firmwareRepair'
import flushDevice from 'commands/flushDevice'
import getAddress from 'commands/getAddress'
import getDeviceInfo from 'commands/getDeviceInfo'
import getIsGenuine from 'commands/getIsGenuine'
import getLatestFirmwareForDevice from 'commands/getLatestFirmwareForDevice'
import installApp from 'commands/installApp'
import killInternalProcess from 'commands/killInternalProcess'
import libcoreGetVersion from 'commands/libcoreGetVersion'
import libcoreReset from 'commands/libcoreReset'
import listenDevices from 'commands/listenDevices'
import ping from 'commands/ping'
import quitAndInstallElectronUpdate from 'commands/quitAndInstallElectronUpdate'
import testApdu from 'commands/testApdu'
import testCrash from 'commands/testCrash'
import testInterval from 'commands/testInterval'
import uninstallApp from 'commands/uninstallApp'
import { commands as bridgeProxyCommands } from '../bridge/proxy'

const all: Array<Command<any, any>> = [
  autoUpdate,
  ...bridgeProxyCommands,
  getAppAndVersion,
  firmwarePrepare,
  firmwareMain,
  firmwareRepair,
  flushDevice,
  getAddress,
  getDeviceInfo,
  getIsGenuine,
  getLatestFirmwareForDevice,
  installApp,
  killInternalProcess,
  libcoreGetVersion,
  libcoreReset,
  listenDevices,
  ping,
  quitAndInstallElectronUpdate,
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
