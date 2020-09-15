import Transport from "winston-transport";

export default class RendererTransport extends Transport {
  ipcRenderer = require("electron").ipcRenderer;

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    this.ipcRenderer.send("log", { log: info });

    callback();
  }
}
