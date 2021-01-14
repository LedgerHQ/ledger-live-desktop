// @flow
import { app, BrowserWindow } from "electron";
import { autoUpdater } from "@ledgerhq/electron-updater";
import logger from "~/logger";
import { getMainWindow } from "~/main/window-lifecycle";
import type { UpdateStatus } from "~/renderer/components/Updater/UpdaterContext";

const sendStatus = (status: UpdateStatus, payload?: *) => {
  const win = getMainWindow();

  if (win) {
    win.webContents.send("updater", { status, payload });
  }
};

const handleDownload = () => {
  // BETA version will check success
  sendStatus("check-success");
};

const init = () => {
  autoUpdater.on("checking-for-update", () => sendStatus("checking-for-update"));
  autoUpdater.on("update-available", info => sendStatus("update-available", info));
  autoUpdater.on("update-not-available", info => sendStatus("update-not-available", info));
  autoUpdater.on("download-progress", p => sendStatus("download-progress", p));
  autoUpdater.on("update-downloaded", handleDownload);
  autoUpdater.on("error", err => {
    logger.error(err);
  });
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
};

const quitAndInstall = () => {
  const browserWindows = BrowserWindow.getAllWindows();

  // Fixes quitAndInstall not quitting on macOS, as suggested on
  // https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-306709572
  app.removeAllListeners("window-all-closed");
  browserWindows.forEach(browserWindow => {
    browserWindow.removeAllListeners("close");
  });

  autoUpdater.quitAndInstall();
};

const downloadUpdate = () => autoUpdater.downloadUpdate();

init();

export default { quitAndInstall, downloadUpdate };
