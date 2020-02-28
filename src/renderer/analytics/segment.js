// @flow

import uuid from "uuid/v4";
import invariant from "invariant";
import logger from "~/logger";
import { getSystemLocale } from "~/helpers/systemLocale";
import user from "~/helpers/user";
import {
  sidebarCollapsedSelector,
  langAndRegionSelector,
  shareAnalyticsSelector,
} from "~/renderer/reducers/settings";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import type { State } from "~/renderer/reducers";

// load analytics
import "./inject-in-window";

invariant(typeof window !== "undefined", "analytics/segment must be called on renderer thread");

const os = require("os");
const osType = os.type();
const osVersion = os.release();

const sessionId = uuid();

const getContext = _store => ({
  ip: "0.0.0.0",
  page: {
    path: "/",
    referrer: "",
    search: "",
    title: "Ledger Live",
    url: "",
  },
});

const extraProperties = store => {
  const state: State = store.getState();
  const { language, region } = langAndRegionSelector(state);
  const systemLocale = getSystemLocale();
  const device = getCurrentDevice(state);
  const deviceInfo = device ? { modelId: device.modelId } : {};
  const sidebarCollapsed = sidebarCollapsedSelector(state);

  return {
    appVersion: __APP_VERSION__,
    language,
    region,
    environment: __DEV__ ? "development" : "production",
    systemLanguage: systemLocale.language,
    systemRegion: systemLocale.region,
    osType,
    osVersion,
    sessionId,
    sidebarCollapsed,
    ...deviceInfo,
  };
};

let storeInstance; // is the redux store. it's also used as a flag to know if analytics is on or off.

export const start = async (store: *) => {
  if (!user) return;
  const { id } = await user();
  logger.analyticsStart(id, extraProperties(store));
  storeInstance = store;
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }
  analytics.identify(id, extraProperties(store), {
    context: getContext(store),
  });
};

export const stop = () => {
  logger.analyticsStop();
  storeInstance = null;
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }
  analytics.reset();
};

export const track = (event: string, properties: ?Object, mandatory: ?boolean) => {
  logger.analyticsTrack(event, properties);
  if (!storeInstance || (!mandatory && !shareAnalyticsSelector(storeInstance.getState()))) {
    return;
  }
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }
  analytics.track(
    event,
    {
      ...extraProperties(storeInstance),
      ...properties,
    },
    {
      context: getContext(storeInstance),
    },
  );
};

export const page = (category: string, name: ?string, properties: ?Object) => {
  logger.analyticsPage(category, name, properties);
  if (!storeInstance || !shareAnalyticsSelector(storeInstance.getState())) {
    return;
  }
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }

  analytics.track(
    `Page ${category + (name ? ` ${name}` : "")}`,
    {
      ...extraProperties(storeInstance),
      ...properties,
    },
    {
      context: getContext(storeInstance),
    },
  );
};
