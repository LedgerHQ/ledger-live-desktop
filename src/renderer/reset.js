// @flow
import { ipcRenderer, shell, remote } from "electron";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { log } from "@ledgerhq/logs";
import { delay } from "@ledgerhq/live-common/lib/promise";
import { useCountervaluesPolling } from "@ledgerhq/live-common/lib/countervalues/react";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import { resetAll, cleanCache } from "~/renderer/storage";
import { cleanAccountsCache } from "~/renderer/actions/accounts";
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

function reload() {
  require("@electron/remote")
    .getCurrentWindow()
    .webContents.reload();
}

export async function hardReset() {
  log("clear-cache", "clearBridgeCache()");
  clearBridgeCache();
  log("clear-cache", "hardReset()");
  disableDBMiddleware();
  resetAll();
  window.localStorage.clear();
}

export function useHardReset() {
  return () => {
    window.localStorage.setItem("hard-reset", "1");
    reload();
  };
}

export function useSoftReset() {
  const dispatch = useDispatch();
  const { wipe } = useCountervaluesPolling();

  return useCallback(async () => {
    log("clear-cache", "clearBridgeCache()");
    clearBridgeCache();
    log("clear-cache", "cleanAccountsCache()");
    dispatch(cleanAccountsCache());
    await delay(500);
    log("clear-cache", "cleanCache()");
    await cleanCache();
    wipe();
    log("clear-cache", "reload()");
    reload();
  }, [dispatch, wipe]);
}

export async function openUserDataFolderAndQuit() {
  shell.showItemInFolder(resolveUserDataDirectory());
  remote.app.quit();
}
