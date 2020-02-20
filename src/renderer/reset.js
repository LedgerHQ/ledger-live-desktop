// @flow

import { log } from "@ledgerhq/logs";
import { ipcRenderer, shell, remote } from "electron";
import path from "path";
import rimraf from "rimraf";

import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import { delay } from "@ledgerhq/live-common/lib/promise";
import { resetAll, cleanCache } from "~/renderer/storage";
import { disable as disableDBMiddleware } from "./middlewares/db";
import { clearBridgeCache } from "./bridge/cache";

let lastKill = 0;

export function recentlyKilledInternalProcess() {
  return Date.now() - lastKill < 5000;
}

export async function killInternalProcess() {
  lastKill = Date.now();
  ipcRenderer.send("clean-processes");
  return delay(1000);
}

const removeSQLite = () =>
  new Promise((resolve, reject) =>
    rimraf(path.resolve(resolveUserDataDirectory(), "sqlite/"), e => {
      if (e) reject(e);
      else resolve();
    }),
  );

async function resetLibcore() {
  log("clear-cache", "resetLibcore...");
  // we need to stop everything that is happening right now, like syncs
  await killInternalProcess();
  log("clear-cache", "killed.");

  await removeSQLite();
  log("clear-cache", "removeSQLite done.");
}

export function onUnusualInternalProcessError() {
  if (recentlyKilledInternalProcess()) return;
  resetLibcore();
}

function reload() {
  require("electron")
    .remote.getCurrentWindow()
    .webContents.reload();
}

export async function hardReset() {
  log("clear-cache", "clearBridgeCache()");
  clearBridgeCache();
  log("clear-cache", "hardReset()");
  disableDBMiddleware();
  resetAll();
  window.localStorage.clear();
  await delay(500);
  await resetLibcore();
  log("clear-cache", "reload()");
  reload();
}

export async function softReset({ cleanAccountsCache }: *) {
  log("clear-cache", "clearBridgeCache()");
  clearBridgeCache();
  log("clear-cache", "cleanAccountsCache()");
  cleanAccountsCache();
  await delay(500);
  log("clear-cache", "cleanCache()");
  await cleanCache();
  await resetLibcore();
  log("clear-cache", "reload()");
  reload();
}

export async function openUserDataFolderAndQuit() {
  shell.openItem(resolveUserDataDirectory());
  remote.app.quit();
}
