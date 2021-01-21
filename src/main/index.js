// @flow
import "./setup";
import { app, Menu, ipcMain } from "electron";
import menu from "./menu";
import {
  createMainWindow,
  getMainWindow,
  getMainWindowAsync,
  loadWindow,
} from "./window-lifecycle";
import "./internal-lifecycle";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import db from "./db";
import debounce from "lodash/debounce";
import logger from "~/logger";
import { hermes } from "~/main/hermesServer";

app.allowRendererProcessReuse = false;

const gotLock = app.requestSingleInstanceLock();
const userDataDirectory = resolveUserDataDirectory();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    const w = getMainWindow();
    if (w) {
      if (w.isMinimized()) {
        w.restore();
      }
      w.focus();
    }
  });
}

app.on("activate", () => {
  const w = getMainWindow();
  if (w) {
    w.focus();
  }
});

app.on("will-finish-launching", () => {
  // macOS deepLink
  app.on("open-url", (event, url) => {
    event.preventDefault();
    getMainWindowAsync()
      .then(w => {
        if (w) {
          show(w);
          if ("send" in w.webContents) {
            w.webContents.send("deep-linking", url);
          }
        }
      })
      .catch(err => console.log(err));
  });

  if (process.platform === "win32") {
    // windows deepLink
    process.argv.forEach(arg => {
      if (/ledgerlive:\/\//.test(arg)) {
        getMainWindowAsync()
          .then(w => {
            if (w) {
              show(w);
              if ("send" in w.webContents) {
                w.webContents.send("deep-linking", arg);
              }
            }
          })
          .catch(err => console.log(err));
      }
    });
  }
});

app.on("ready", async () => {
  if (__DEV__) {
    await installExtensions();
  }

  const { port } = await hermes.start();

  hermes.registerProcedure("test", async (args) => {
    console.log("called test with args: ", args);
    return "done";
  });

  hermes.registerProcedure("getKey", async ({ ns, keyPath, defaultValue }) => {
    return db.getKey(ns, keyPath, defaultValue);
  });

  hermes.registerProcedure("setKey", async ({ ns, keyPath, value }) => {
    return db.setKey(ns, keyPath, value);
  });

  hermes.registerProcedure("hasEncryptionKey", async ({ ns, keyPath }) => {
    return db.hasEncryptionKey(ns, keyPath);
  });

  hermes.registerProcedure("setEncryptionKey", async ({ ns, keyPath, encryptionKey }) => {
    return db.setEncryptionKey(ns, keyPath, encryptionKey);
  });

  hermes.registerProcedure("removeEncryptionKey", async ({ ns, keyPath }) => {
    return db.removeEncryptionKey(ns, keyPath);
  });

  hermes.registerProcedure("isEncryptionKeyCorrect", async ({ ns, keyPath, encryptionKey }) => {
    return db.isEncryptionKeyCorrect(ns, keyPath, encryptionKey);
  });

  hermes.registerProcedure("isEncryptionKeyCorrect", async ({ ns, keyPath, encryptionKey }) => {
    return db.isEncryptionKeyCorrect(ns, keyPath, encryptionKey);
  });

  hermes.registerProcedure("hasBeenDecrypted", ({ ns, keyPath }) => {
    return db.hasBeenDecrypted(ns, keyPath);
  });

  hermes.registerProcedure("resetAll", () => {
    return db.resetAll();
  });

  hermes.registerProcedure("reload", () => {
    return db.reload();
  });

  hermes.registerProcedure("cleanCache", () => {
    return db.cleanCache();
  });

  hermes.registerProcedure("reloadRenderer", () => {
    console.log("reloading renderer ...");
    loadWindow(port);
  });

  db.init(userDataDirectory);

  ipcMain.on("log", (event, { log }) => logger.log(log));

  Menu.setApplicationMenu(menu);

  const windowParams = await db.getKey("windowParams", "MainWindow", {});
  const settings = await db.getKey("app", "settings");

  const window = await createMainWindow(windowParams, settings, port);

  window.on(
    "resize",
    debounce(() => {
      const [width, height] = window.getSize();
      db.setKey("windowParams", `${window.name}.dimensions`, {
        width,
        height,
      });
    }, 300),
  );

  window.on(
    "move",
    debounce(() => {
      const [x, y] = window.getPosition();
      db.setKey("windowParams", `${window.name}.positions`, { x, y });
    }, 300),
  );

  await clearSessionCache(window.webContents.session);
});

ipcMain.on("ready-to-show", () => {
  const w = getMainWindow();
  if (w) {
    show(w);
  }
});

async function installExtensions() {
  const installer = require("electron-devtools-installer");
  const forceDownload = true; // process.env.UPGRADE_EXTENSIONS
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
}

function clearSessionCache(session) {
  return new Promise(resolve => {
    session.clearCache(resolve);
  });
}

function show(win) {
  win.show();
  setImmediate(() => win.focus());
}
