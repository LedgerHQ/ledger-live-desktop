// @flow

import "../live-common-setup-base";
import { ipcMain } from "electron";
import contextMenu from "electron-context-menu";
import logger, { enableDebugLogger } from "../logger";
import LoggerTransport from "~/logger/logger-transport-main";
import LoggerTransportFirmware from "~/logger/logger-transport-firmware";
import { fsWriteFile, fsReadFile, fsUnlink } from "~/helpers/fs";
import osName from "~/helpers/osName";
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

ipcMain.handle(
  "export-operations",
  async (event, path: { canceled: boolean, filePath: string }, csv: string): Promise<boolean> => {
    try {
      if (!path.canceled && path.filePath && csv) {
        await fsWriteFile(path.filePath, csv);
        return true;
      }
    } catch (error) {}

    return false;
  },
);

ipcMain.handle("generate-lss-config", async (event, filePath, data: string): Promise<boolean> => {
  try {
    if (filePath && data) {
      await fsWriteFile(filePath, data);
      return true;
    }
  } catch (error) {}

  return false;
});

ipcMain.handle("delete-lss-config", async (event, filePath): Promise<boolean> => {
  try {
    if (filePath) {
      await fsUnlink(filePath);
      return true;
    }
  } catch (error) {}

  return false;
});

ipcMain.handle("load-lss-config", async (event, filePath): Promise<?string> => {
  try {
    if (filePath) {
      return await fsReadFile(filePath, "utf8");
    }
  } catch (error) {}

  return undefined;
});

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

const systemInfo = async () => {
  const name = await osName();
  const locale = await require("os-locale")();

  logger.info(`Ledger Live version: ${__APP_VERSION__}`, { type: "system-info" });
  logger.info(`OS: ${name}`, { type: "system-info" });
  logger.info(`System locale: ${locale}`, { type: "system-info" });
};

systemInfo();
