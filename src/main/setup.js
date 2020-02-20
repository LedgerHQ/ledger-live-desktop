// @flow

import "../env";
import { ipcMain } from "electron";
import contextMenu from "electron-context-menu";
import logger, { enableDebugLogger } from "../logger";
import LoggerTransport from "~/logger/logger-transport-main";
import LoggerTransportFirmware from "~/logger/logger-transport-firmware";
import { fsWriteFile } from "~/helpers/fs";
import updater from "./updater";

const loggerTransport = new LoggerTransport();
const loggerFirmwareTransport = new LoggerTransportFirmware();
logger.add(loggerTransport);
logger.add(loggerFirmwareTransport);

if (process.env.DEV_TOOLS) {
  enableDebugLogger();
}

ipcMain.on("updater", (e, type) => {
  updater(type);
});

ipcMain.handle("save-logs", async (event, path: { canceled: boolean, filePath: string }) =>
  Promise.resolve().then(
    () =>
      !path.canceled &&
      path.filePath &&
      fsWriteFile(path.filePath, JSON.stringify(loggerTransport.logs)),
  ),
);

process.setMaxListeners(0);

// eslint-disable-next-line no-console
console.log(`Ledger Live ${__APP_VERSION__}`);

contextMenu({
  showInspectElement: __DEV__,
  showCopyImageAddress: false,
  // TODO: i18n for labels
  labels: {
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    copyLink: "Copy Link",
    inspect: "Inspect element",
  },
});
