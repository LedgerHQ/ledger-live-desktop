import Transport from "winston-transport";

export default class InternalTransport extends Transport {
  log(log, callback) {
    setImmediate(() => {
      this.emit("logged", log);
    });

    console.log(JSON.stringify({ type: "log", log }));

    callback();
  }
}
