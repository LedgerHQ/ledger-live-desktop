import Transport from "winston-transport";

export default class MainTransport extends Transport {
  logs = [];
  capacity = 3000;
  blacklist = [];

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    if (!this.blacklist.includes(info.type)) {
      this.logs.unshift(info);
      this.logs.splice(this.capacity);
    }

    callback();
  }
}
