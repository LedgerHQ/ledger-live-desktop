import { app } from "electron";
import path from "path";
import winston from "winston";

import moment from "moment";

import { add } from "./logger";

export async function enableFileLogger() {
  await app.whenReady();
  const desktopDir = app.getPath("desktop");

  const fileT = new winston.transports.File({
    filename: path.join(
      desktopDir,
      `ledgerlive-logs-${moment().format("YYYY.MM.DD-HH.mm.ss")}-${__GIT_REVISION__ ||
        "unversioned"}.log`,
    ),
  });

  add(fileT);
}
