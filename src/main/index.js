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
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import sentry from "~/sentry/main";

require("@electron/remote/main").initialize();

app.allowRendererProcessReuse = false;

const gotLock = app.requestSingleInstanceLock();
const userDataDirectory = resolveUserDataDirectory();

const sentryEnabled = !!process.env.INITIAL_SENTRY_ENABLED || false;

if (process.env.SENTRY_USER_ID) {
  sentry(() => sentryEnabled, process.env.SENTRY_USER_ID);
}

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

      // Deep linking for when the app is already running (Windows, Linux)
      if (process.platform === "win32" || process.platform === "linux") {
        const uri = commandLine.filter(arg => arg.startsWith("ledgerlive://"));

        if (uri.length) {
          if ("send" in w.webContents) {
            w.webContents.send("deep-linking", uri[0]);
          }
        }
      }
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
});

app.on("ready", async () => {
  db.init(userDataDirectory);
  app.dirname = __dirname;
  ipcMain.handle("getKey", (event, { ns, keyPath, defaultValue }) => {
    return db.getKey(ns, keyPath, defaultValue);
  });

  ipcMain.handle("setKey", (event, { ns, keyPath, value }) => {
    return db.setKey(ns, keyPath, value);
  });

  ipcMain.handle("hasEncryptionKey", (event, { ns, keyPath }) => {
    return db.hasEncryptionKey(ns, keyPath);
  });

  ipcMain.handle("setEncryptionKey", (event, { ns, keyPath, encryptionKey }) => {
    return db.setEncryptionKey(ns, keyPath, encryptionKey);
  });

  ipcMain.handle("removeEncryptionKey", (event, { ns, keyPath }) => {
    return db.removeEncryptionKey(ns, keyPath);
  });

  ipcMain.handle("isEncryptionKeyCorrect", (event, { ns, keyPath, encryptionKey }) => {
    return db.isEncryptionKeyCorrect(ns, keyPath, encryptionKey);
  });

  ipcMain.handle("hasBeenDecrypted", (event, { ns, keyPath }) => {
    return db.hasBeenDecrypted(ns, keyPath);
  });

  ipcMain.handle("resetAll", () => {
    return db.resetAll();
  });

  ipcMain.handle("reload", () => {
    return db.reload();
  });

  ipcMain.handle("cleanCache", () => {
    return db.cleanCache();
  });

  ipcMain.handle("reloadRenderer", () => {
    console.log("reloading renderer ...");
    loadWindow();
  });

  ipcMain.on("log", (event, { log }) => logger.log(log));

  Menu.setApplicationMenu(menu);

  const windowParams = await db.getKey("windowParams", "MainWindow", {});
  const settings = await db.getKey("app", "settings");

  const window = await createMainWindow(windowParams, settings);

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

app.whenReady().then(async () => {
  if (__DEV__) {
    await installExtensions();
  }
});

ipcMain.on("ready-to-show", () => {
  const w = getMainWindow();
  if (w) {
    show(w);

    // Deep linking for when the app is not running already (Windows, Linux)
    if (process.platform === "win32" || process.platform === "linux") {
      const { argv } = process;
      const uri = argv.filter(arg => arg.startsWith("ledgerlive://"));

      if (uri.length) {
        if ("send" in w.webContents) {
          w.webContents.send("deep-linking", uri[0]);
        }
      }
    }
  }
});

async function installExtensions() {
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  await installExtension(extensions);
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
