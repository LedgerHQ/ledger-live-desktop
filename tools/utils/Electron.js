const execa = require("execa");

const defaultElectronPath = "./node_modules/.bin/electron";

class Electron {
  constructor(bundlePath, electronPath = defaultElectronPath) {
    this.instance = null;
    this.bundlePath = bundlePath;
    this.electronPath = electronPath;
  }

  start() {
    if (!this.instance) {
      const args = (process.env.ELECTRON_ARGS || "").split(/[ ]+/).filter(Boolean);
      if (args.length) console.log("electron starts with", args);
      this.instance = execa(this.electronPath, [this.bundlePath, ...args]);
      this.instance.stdout.pipe(process.stdout);
      this.instance.stderr.pipe(process.stderr);
    }
  }

  stop() {
    if (this.instance) {
      this.instance.cancel();
      this.instance = null;
    }
  }

  reload() {
    if (this.instance) {
      this.stop();
      this.start();
    }
  }
}

module.exports = Electron;
