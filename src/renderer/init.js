// @flow

import { NotEnoughBalance } from "@ledgerhq/errors";
import Transport from "@ledgerhq/hw-transport";
import { implicitMigration } from "@ledgerhq/live-common/lib/migrations/accounts";
import { checkLibs } from "@ledgerhq/live-common/lib/sanityChecks";
import { log } from "@ledgerhq/logs";
import { ipcRenderer, remote, webFrame } from "electron";
import got from "got-cjs";
import i18n from "i18next";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import { disableGlobalTab, enableGlobalTab, isGlobalTabEnabled } from "~/config/global-tab";
import { setEnvOnAllThreads } from "~/helpers/env";
import logger, { enableDebugLogger } from "~/logger";
import LoggerTransport from "~/logger/logger-transport-renderer";
import { setAccounts } from "~/renderer/actions/accounts";
import { lock, setOSDarkMode } from "~/renderer/actions/application";
import { fetchSettings, setDeepLinkUrl } from "~/renderer/actions/settings";
import AppError from "~/renderer/AppError";
import { command } from "~/renderer/commands";
import createStore from "~/renderer/createStore";
import events from "~/renderer/events";
import { getLocalStorageEnvs } from "~/renderer/experimental";
import "~/renderer/i18n/init";
import "~/renderer/live-common-setup";
import dbMiddleware from "~/renderer/middlewares/db";
import ReactRoot from "~/renderer/ReactRoot";
import {
  hideEmptyTokenAccountsSelector,
  languageSelector,
  localeSelector,
  sentryLogsSelector
} from "~/renderer/reducers/settings";
import { hardReset } from "~/renderer/reset";
import { getKey, loadLSS, reload } from "~/renderer/storage";
import "~/renderer/styles/global";
import sentry from "~/sentry/browser";

logger.add(new LoggerTransport());

if (process.env.NODE_ENV !== "production" || process.env.DEV_TOOLS) {
  enableDebugLogger();
}

const http = require("http");
const https = require("https");
const { SocksProxyAgent } = require("socks-proxy-agent");

const hostname = "127.0.0.1";
const port = "9050";
const agent = new SocksProxyAgent({
  host: `${hostname}${port}`,
  hostname,
  port,
  protocol: "socks5h:",
});

http.globalAgent = https.globalAgent = agent;

const rootNode = document.getElementById("react-root");

const TAB_KEY = 9;

async function init() {
  checkLibs({
    NotEnoughBalance,
    React,
    log,
    Transport,
    connect,
  });

  if (process.env.PLAYWRIGHT_RUN) {
    const spectronData = await getKey("app", "PLAYWRIGHT_RUN", {});
    _.each(spectronData.localStorage, (value, key) => {
      global.localStorage.setItem(key, value);
    });

    const envs = getLocalStorageEnvs();
    for (const k in envs) setEnvOnAllThreads(k, envs[k]);

    const timemachine = require("timemachine");
    timemachine.config({
      dateString: require("../../tests/time").default,
    });

    if (document.body) {
      document.body.className += " spectron-run";
    }
  }

  if (window.localStorage.getItem("hard-reset")) {
    await hardReset();
  }

  const store = createStore({ dbMiddleware });

  sentry(() => sentryLogsSelector(store.getState()));

  let deepLinkUrl; // Nb In some cases `fetchSettings` runs after this, voiding the deep link.
  ipcRenderer.once("deep-linking", (event, url) => {
    store.dispatch(setDeepLinkUrl(url));
    deepLinkUrl = url;
  });

  const initialSettings = await getKey("app", "settings", {});

  store.dispatch(
    fetchSettings(deepLinkUrl ? { ...initialSettings, deepLinkUrl } : initialSettings),
  );

  const state = store.getState();
  const language = languageSelector(state);
  const locale = localeSelector(state);

  // Moment.JS config
  moment.locale(locale);
  moment.relativeTimeThreshold("s", 45);
  moment.relativeTimeThreshold("m", 55);
  moment.relativeTimeThreshold("h", 24);
  moment.relativeTimeThreshold("d", 31);
  moment.relativeTimeThreshold("M", 12);

  i18n.changeLanguage(language);

  await loadLSS(); // Set env handled inside

  const hideEmptyTokenAccounts = hideEmptyTokenAccountsSelector(state);
  setEnvOnAllThreads("HIDE_EMPTY_TOKEN_ACCOUNTS", hideEmptyTokenAccounts);

  const isMainWindow = remote.getCurrentWindow().name === "MainWindow";

  let accounts = await getKey("app", "accounts", []);
  if (accounts) {
    accounts = implicitMigration(accounts);
    await store.dispatch(setAccounts(accounts));
  } else {
    store.dispatch(lock());
  }
  const initialCountervalues = await getKey("app", "countervalues");

  r(<ReactRoot store={store} language={language} initialCountervalues={initialCountervalues} />);

  if (isMainWindow) {
    webFrame.setVisualZoomLevelLimits(1, 1);

    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const updateOSTheme = () => store.dispatch(setOSDarkMode(matcher.matches));
    matcher.addListener(updateOSTheme);

    events({ store });

    const libcoreVersion = await command("libcoreGetVersion")().toPromise();
    logger.log("libcore", libcoreVersion);

    window.addEventListener("keydown", (e: SyntheticKeyboardEvent<any>) => {
      if (e.which === TAB_KEY) {
        if (!isGlobalTabEnabled()) enableGlobalTab();
        logger.onTabKey(document.activeElement);
      }
    });

    window.addEventListener("click", () => {
      if (isGlobalTabEnabled()) disableGlobalTab();
    });

    window.addEventListener("beforeunload", async () => {
      // This event is triggered when we reload the app, we want it to forget what it knows
      reload();
    });
  }

  document.addEventListener(
    "dragover",
    (event: Event) => {
      event.preventDefault();
      return false;
    },
    false,
  );

  document.addEventListener(
    "drop",
    (event: Event) => {
      event.preventDefault();
      return false;
    },
    false,
  );

  if (document.body) {
    const classes = document.body.classList;
    let timer = 0;
    window.addEventListener("resize", () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      } else classes.add("stop-all-transition");

      timer = setTimeout(() => {
        classes.remove("stop-all-transition");
        timer = null;
      }, 500);
    });
  }

  // expose stuff in Windows for DEBUG purpose
  window.ledger = {
    store,
    testFunc: () => {
      return got("http://ifconfig.me/ip").text();
    },
  };
}

function r(Comp) {
  if (rootNode) {
    render(Comp, rootNode);
  }
}

init()
  .catch(e => {
    logger.critical(e);
    r(<AppError error={e} language="en" />);
  })
  .catch(error => {
    const pre = document.createElement("pre");
    pre.innerHTML = `Ledger Live crashed. Please contact Ledger support.
  ${String(error)}
  ${String((error && error.stack) || "no stacktrace")}`;
    if (document.body) {
      document.body.style.padding = "50px";
      document.body.innerHTML = "";
      document.body.appendChild(pre);
    }
  });
