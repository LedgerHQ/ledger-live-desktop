// @flow

import { app, ipcMain } from "electron";
import path from "path";
import rimraf from "rimraf";
import { setEnvUnsafe, getAllEnvs } from "@ledgerhq/live-common/lib/env";
import { isRestartNeeded } from "~/helpers/env";
import logger from "~/logger";
import { getMainWindow } from "./window-lifecycle";
import InternalProcess from "./InternalProcess";

// ~~~ Local state that main thread keep

const hydratedPerCurrency = {};

// ~~~

const LEDGER_CONFIG_DIRECTORY = app.getPath("userData");
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath("userData"), "sqlite");

const internal = new InternalProcess({ timeout: 3000 });

const cleanUpBeforeClosingSync = () => {
  rimraf.sync(path.resolve(LEDGER_CONFIG_DIRECTORY, "sqlite/*.log"));
};

const sentryEnabled = false;
const userId = "TODO";

const spawnCoreProcess = () => {
  const env = {
    ...getAllEnvs(),
    // $FlowFixMe
    ...process.env,
    IS_INTERNAL_PROCESS: 1,
    LEDGER_CONFIG_DIRECTORY,
    LEDGER_LIVE_SQLITE_PATH,
    INITIAL_SENTRY_ENABLED: sentryEnabled,
    SENTRY_USER_ID: userId,
  };

  internal.configure(path.resolve(__dirname, "main.bundle.js"), [], {
    env,
    execArgv: (process.env.LEDGER_INTERNAL_ARGS || "").split(/[ ]+/).filter(Boolean),
    silent: true,
  });
  internal.start();
};

internal.onStart(() => {
  internal.process.on("message", handleGlobalInternalMessage);

  internal.send({
    type: "init",
    hydratedPerCurrency,
  });
});

app.on("window-all-closed", async () => {
  logger.info("cleaning internal because main is done");
  if (internal.active) {
    await internal.stop();
  }
  cleanUpBeforeClosingSync();
  app.quit();
});

ipcMain.on("clean-processes", async () => {
  logger.info("cleaning processes on demand");
  if (internal.active) {
    await internal.stop();
  }
  spawnCoreProcess();
});

const ongoing = {};

internal.onMessage(message => {
  const event = ongoing[message.requestId];
  if (event) {
    event.reply("command-event", message);

    if (message.type === "cmd.ERROR" || message.type === "cmd.COMPLETE") {
      delete ongoing[message.requestId];
    }
  }
});

internal.onExit((code, signal, unexpected) => {
  if (unexpected) {
    Object.keys(ongoing).forEach(requestId => {
      const event = ongoing[requestId];
      event.reply("command-event", {
        type: "cmd.ERROR",
        requestId,
        data: {
          message:
            code !== null
              ? `Internal process error (${code})`
              : `Internal process killed by signal (${signal})`,
          name: "InternalError",
        },
      });
    });
  }
});

ipcMain.on("command", (event, command) => {
  ongoing[command.requestId] = event;
  internal.send({ type: "command", command });
});

ipcMain.on("command-unsubscribe", (event, { requestId }) => {
  delete ongoing[requestId];
  internal.send({ type: "command-unsubscribe", requestId });
});

function handleGlobalInternalMessage(payload) {
  switch (payload.type) {
    case "uncaughtException": {
      // FIXME
      // const err = deserializeError(payload.error)
      // captureException(err)
      break;
    }
    case "setLibcoreBusy":
    case "setDeviceBusy": {
      const win = getMainWindow && getMainWindow();
      if (!win) {
        logger.warn(`can't ${payload.type} because no renderer`);
        return;
      }
      win.webContents.send(payload.type, payload);
      break;
    }
    default:
  }
}

// FIXME this should be a done with a env instead.
/*
ipcMain.on('sentryLogsChanged', (event, payload) => {
  sentryEnabled = payload.value
  const p = internalProcess
  if (!p) return
  p.send({ type: 'sentryLogsChanged', payload })
})
*/

ipcMain.on("setEnv", async (event, env) => {
  const { name, value } = env;

  if (setEnvUnsafe(name, value)) {
    if (isRestartNeeded(name)) {
      if (internal.active) {
        await internal.stop();
      }
      spawnCoreProcess();
    } else {
      internal.send({ type: "setEnv", env });
    }
  }
});

ipcMain.on("hydrateCurrencyData", (event, { currencyId, serialized }) => {
  if (hydratedPerCurrency[currencyId] === serialized) return;
  hydratedPerCurrency[currencyId] = serialized;

  internal.send({ type: "hydrateCurrencyData", serialized, currencyId });
});
