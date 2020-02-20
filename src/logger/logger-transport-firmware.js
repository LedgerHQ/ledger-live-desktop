import "../env";
import path from "path";
import moment from "moment";
import { app } from "electron";
import Transport from "winston-transport";
import { fsWriteFile } from "~/helpers/fs";

const FIRMWARE_LOG_PATH = path.resolve(app.getPath("userData"));

export default class FirmwareTransport extends Transport {
  logs = [];
  active = false;
  whitelist = [
    "hw",
    "apdu",
    "socket-opened",
    "socket-in",
    "socket-out",
    "socket-error",
    "socket-message-error",
    "socket-close",
    "cmd.ERROR",
  ];

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    if (info.type === "firmware-record-start") {
      this.active = true;
      this.logs = [];
    }

    if (info.type === "firmware-record-cancel") {
      this.active = false;
      this.logs = [];
    }

    if (info.type === "firmware-record-end") {
      this.active = false;
      const logsName = `ledgerlive-fwupdate-${moment().format(
        "YYYY.MM.DD-HH.mm.ss",
      )}-${__GIT_REVISION__ || "unversioned"}.json`;

      fsWriteFile(`${FIRMWARE_LOG_PATH}/${logsName}`, JSON.stringify(this.logs))
        .catch(err => console.error(err))
        .finally(() => {
          this.logs = [];
        });
    }

    if (this.active && this.whitelist.includes(info.type)) {
      this.logs.unshift(info);
    }

    callback();
  }
}
