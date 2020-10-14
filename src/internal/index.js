// @flow
import { unsubscribeSetup } from "./live-common-setup";

import { setEnvUnsafe } from "@ledgerhq/live-common/lib/env";
import { serializeError } from "@ledgerhq/errors";
import { getCurrencyBridge } from "@ledgerhq/live-common/lib/bridge";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { log } from "@ledgerhq/logs";
import logger from "~/logger";
import LoggerTransport from "~/logger/logger-transport-internal";

import { executeCommand, unsubscribeCommand, unsubscribeAllCommands } from "./commandHandler";
import sentry from "~/sentry/node";
// import uuid from 'uuid/v4'

process.on("exit", () => {
  logger.debug("exiting process, unsubscribing all...");
  unsubscribeSetup();
  unsubscribeAllCommands();
});

logger.add(new LoggerTransport());

process.title = "Ledger Live Internal";

process.on("uncaughtException", err => {
  // $FlowFixMe TODO
  process.send({
    type: "uncaughtException",
    error: serializeError(err),
  });
  // FIXME we should ideally do this:
  // process.exit(1)
  // but for now, until we kill all exceptions:
  logger.critical(err, "uncaughtException");
});

const defers = {};

// eslint-disable-next-line no-unused-vars
let sentryEnabled = !!process.env.INITIAL_SENTRY_ENABLED || false;
if (process.env.SENTRY_USER_ID) {
  sentry(() => sentryEnabled, process.env.SENTRY_USER_ID);
}

process.on("message", m => {
  switch (m.type) {
    case "command":
      // $FlowFixMe TODO
      executeCommand(m.command, process.send.bind(process));
      break;

    case "command-unsubscribe":
      unsubscribeCommand(m.requestId);
      break;

    case "executeHttpQueryPayload": {
      const { payload } = m;
      const defer = defers[payload.id];
      if (!defer) {
        logger.warn("executeHttpQueryPayload: no defer found");
        return;
      }
      if (payload.type === "success") {
        defer.resolve(payload.result);
      } else {
        defer.reject(payload.error);
      }
      break;
    }

    case "sentryLogsChanged": {
      const { payload } = m;
      sentryEnabled = payload.value;
      break;
    }

    case "hydrateCurrencyData": {
      const { currencyId, serialized } = m;
      const currency = getCryptoCurrencyById(currencyId);
      const data = serialized && JSON.parse(serialized);
      log("hydrateCurrencyData", `hydrate currency ${currency.id}`);
      getCurrencyBridge(currency).hydrate(data, currency);
      break;
    }

    case "init": {
      const { hydratedPerCurrency } = m;

      // hydrate all
      log("init", `hydrate currencies ${Object.keys(hydratedPerCurrency).join(", ")}`);
      Object.keys(hydratedPerCurrency).forEach(currencyId => {
        const currency = getCryptoCurrencyById(currencyId);
        const serialized = hydratedPerCurrency[currencyId];
        const data = serialized && JSON.parse(serialized);
        getCurrencyBridge(currency).hydrate(data, currency);
      });

      break;
    }

    case "setEnv": {
      const { name, value } = m.env;
      setEnvUnsafe(name, value);
      break;
    }

    default:
      log("error", `internal thread: '${m.type}' event not supported`);
  }
});

process.on("disconnect", () => {
  process.exit(0);
});

log("internal", "Internal process is up!");
