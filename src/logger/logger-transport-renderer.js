import Transport from "winston-transport";

export default class RendererTransport extends Transport {
  ipcRenderer = require("electron").ipcRenderer;

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      this.ipcRenderer.send("log", { log: info });
    } catch (e) {
      // a malformed tracking data can cause issues to arise better fail safe this
      console.error(e, info);
    }

    callback();
  }
}
