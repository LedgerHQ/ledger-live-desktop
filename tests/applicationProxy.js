import os from "os";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { Application } from "spectron";
import electronPath from "electron";

export function getUserPath() {
  const platform = os.platform();
  let path;

  if (platform === "darwin") {
    path = `${os.homedir()}/Library/Application Support/Electron`;
  } else if (platform === "win32") {
    path = `${os.homedir()}/AppData/Roaming/Electron`;
  } else {
    path = `${os.homedir()}/.config/Electron`;
  }

  return path;
}

export function applicationProxy(envVar = {}, userData = null) {
  const userPath = getUserPath();

  if (fs.existsSync(userPath)) rimraf.sync(userPath);

  if (userData != null) {
    const jsonFile = path.resolve("tests/setups/", userData);

    fs.mkdirSync(userPath);
    console.log(`${userPath}/app.json`);
    fs.copyFileSync(jsonFile, `${userPath}/app.json`);
  }

  return new Application({
    path: electronPath,
    args: [`${process.cwd()}/.webpack/main.bundle.js`],
    chromeDriverArgs: [
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--lang=en",
    ],
    env: envVar,
  });
}
