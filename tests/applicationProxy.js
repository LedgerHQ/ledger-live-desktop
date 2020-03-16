import os from "os";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { Application } from "spectron";
const { version } = require(`${process.cwd()}/package.json`);

export function getConfigPath() {
  const platform = os.platform();
  let userDataPath;
  if (platform === "darwin") {
    userDataPath = `${os.homedir()}/Library/Application Support/Ledger Live`;
  } else if (platform === "win32") {
    userDataPath = "%AppData\\Roaming\\Ledger Live";
  } else {
    userDataPath = ".config/Ledger live";
  }
  return userDataPath;
}

export function getScreenshotPath(name) {
  const screenshotPath = path.resolve(__dirname, "../data/screenshots");
  return `${screenshotPath}/${name}.png`;
}

function getAppPath() {
  const platform = os.platform();
  let appPath;
  if (platform === "darwin") {
    appPath = "./dist/mac/Ledger Live.app/Contents/MacOS/Ledger Live";
  } else if (platform === "win32") {
    appPath = ".\\dist\\win-unpacked\\Ledger Live.exe";
  } else {
    appPath = `./dist/ledger-live-desktop-${version}-linux-x86_64.AppImage`;
  }
  return appPath;
}

export function applicationProxy(userData = null, envVar = {}) {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    rimraf.sync(configPath);
    fs.mkdirSync(configPath);
  }
  if (userData != null) {
    const jsonFile = path.resolve("tests/setups/", userData);
    fs.copyFileSync(jsonFile, `${configPath}/app.json`);
  }
  const app = new Application({
    path: getAppPath(),
    chromeDriverArgs: [
      "--disable-extensions",
      "disable-dev-shm-usage",
      "--no-sandbox",
      "remote-debugging-port=" + Math.floor(Math.random() * (9999 - 9000) + 9000),
    ],
    env: envVar,
  });
  console.log("app", app);
  return app;
}
