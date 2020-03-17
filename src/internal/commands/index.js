// @flow
import firmwarePrepare from "./firmwarePrepare";
import firmwareMain from "./firmwareMain";
import firmwareRepair from "./firmwareRepair";
import flushDevice from "./flushDevice";
import getDeviceInfo from "./getDeviceInfo";
import getLatestFirmwareForDevice from "./getLatestFirmwareForDevice";
import libcoreGetVersion from "./libcoreGetVersion";
import libcoreReset from "./libcoreReset";
import listenDevices from "./listenDevices";
import listApps from "./listApps";
import ping from "./ping";
import connectApp from "./connectApp";
import connectManager from "./connectManager";
import testApdu from "./testApdu";
import testCrash from "./testCrash";
import testInterval from "./testInterval";
import appOpExec from "./appOpExec";
import initSwap from "./initSwap";
import { commands as bridgeProxyCommands } from "~/renderer/bridge/proxy-commands";

export const commandsById = {
  appOpExec,
  ...bridgeProxyCommands,
  firmwarePrepare,
  firmwareMain,
  firmwareRepair,
  flushDevice,
  getDeviceInfo,
  getLatestFirmwareForDevice,
  libcoreGetVersion,
  libcoreReset,
  listenDevices,
  connectApp,
  connectManager,
  listApps,
  ping,
  testApdu,
  initSwap,
  testCrash,
  testInterval,
};

export type Commands = typeof commandsById;
export type CommandFn<Id: $Keys<Commands>> = $ElementType<Commands, Id>;
