// @flow
import { app, BrowserWindow } from "electron";
import { autoUpdater } from "@ledgerhq/electron-updater";
import logger from "~/logger";
import { getMainWindow } from "~/main/window-lifecycle";
import type { UpdateStatus } from "~/renderer/components/Updater/UpdaterContext";

import createElectronAppUpdater from "./createElectronAppUpdater";

const UPDATE_CHECK_IGNORE = Boolean(process.env.UPDATE_CHECK_IGNORE);
const UPDATE_CHECK_FEED =
  process.env.UPDATE_CHECK_FEED || "http://resources.live.ledger.app/public_resources/signatures";

const sendStatus = (status: UpdateStatus, payload?: *) => {
  const win = getMainWindow();

  if (win) {
    win.webContents.send("updater", { status, payload });
  }
};

const handleDownload = async info => {
  try {
    sendStatus("checking");
    const appUpdater = await createElectronAppUpdater({ feedURL: UPDATE_CHECK_FEED, info });
    await appUpdater.verify();
    sendStatus("check-success");
  } catch (err) {
    logger.critical(err);
    if (UPDATE_CHECK_IGNORE) {
      sendStatus("check-success");
    } else {
      sendStatus("error", err);
    }
  }
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

  autoUpdater.autoInstallOnAppQuit = false;
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
