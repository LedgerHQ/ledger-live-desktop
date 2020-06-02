import fs from "fs";
import electronPath from "electron";
import path from "path";
import rimraf from "rimraf";
import { Application } from "spectron";

const userDataPath = `${__dirname}/tmp/${Math.random()
  .toString(36)
  .substring(2, 5)}`;

export const removeUserData = () => {
  if (fs.existsSync(`${userDataPath}`)) {
    rimraf.sync(userDataPath);
  }
};

export function applicationProxy(envVar, userData = null) {
  fs.mkdirSync(userDataPath, { recursive: true });

  if (userData !== null) {
    const jsonFile = path.resolve("tests/setups/", `${userData}.json`);
    fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
  }

  const bundlePath = path.join(process.cwd(), "/.webpack/main.bundle.js");

  return new Application({
    path: electronPath,
    args: [bundlePath],
    chromeDriverArgs: [
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--lang=en",
      `--user-data-dir=${userDataPath}`,
    ],
    env: envVar,
  });
}

export const getMockDeviceEvent = app => async (...events) => {
  return await app.client.execute(e => {
    window.mock.events.mockDeviceEvent(...e);
  }, events);
};
