// @flow
import React, { useCallback, useMemo } from "react";
import { AnnouncementProvider } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import type { Announcement } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/types";
import { getKey, setKey } from "~/renderer/storage";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import { languageSelector, lastSeenDeviceSelector } from "~/renderer/reducers/settings";
import { useSelector, useDispatch } from "react-redux";
import { ServiceStatusProvider } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider/index";
import { openInformationCenter } from "~/renderer/actions/UI";
import { track } from "~/renderer/analytics/segment";
import fetchApi from "../../../tests/mocks/notificationsHelpers";
import networkApi from "../../../tests/mocks/serviceStatusHelpers";

let notificationsApi;
let serviceStatusApi;

if (process.env.MOCK || process.env.PLAYWRIGHT_RUN) {
  notificationsApi = fetchApi;
  serviceStatusApi = networkApi;
}

type Props = {
  children: React$Node,
};

async function saveAnnouncements({
  announcements,
  seenIds,
  lastUpdateTime,
}: {
  announcements: Announcement[],
  seenIds: string[],
  lastUpdateTime: number,
}) {
  setKey("app", "announcements", {
    announcements,
    seenIds,
    lastUpdateTime,
  });
}

async function loadAnnouncements(): Promise<{
  announcements: Announcement[],
  seenIds: string[],
  lastUpdateTime: number,
}> {
  const data = await getKey("app", "announcements", {
    announcements: [],
    seenIds: [],
    lastUpdateTime: new Date().getTime(),
  });
  return data;
}

const getOsPlatform = () => {
  switch (process.platform) {
    case "darwin":
      return "mac";

    case "win32":
    case "win64":
      return "windows";

    case "linux":
      return "linux";

    default:
      return undefined;
  }
};

export function AnnouncementProviderWrapper({ children }: Props) {
  const startDate = useMemo(() => new Date(), []);
  const language = useSelector(languageSelector);
  const currenciesRaw = useSelector(cryptoCurrenciesSelector);
  const { currencies, tickers } = currenciesRaw.reduce(
    ({ currencies, tickers }, { id, ticker }) => ({
      currencies: [...currencies, id],
      tickers: [...tickers, ticker],
    }),
    { currencies: [], tickers: [] },
  );
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const dispatch = useDispatch();
  const osPlatform = getOsPlatform();

  // $FlowFixMe please help on fixing this. bad type on live-common?
  const { pushToast, dismissToast } = useToasts();

  const context = {
    language,
    currencies,
    getDate: () => new Date(),
    lastSeenDevice: lastSeenDevice || undefined,
    platform: osPlatform,
    appVersion: __APP_VERSION__,
  };

  const onNewAnnouncement = useCallback(
    (announcement: Announcement) => {
      // eslint-disable-next-line camelcase
      const { uuid, content, icon, utm_campaign, published_at } = announcement;

      track("Announcement Received", {
        uuid,
        utm_campaign,
      });

      if (new Date(published_at) > startDate) {
        pushToast({
          id: uuid,
          type: "announcement",
          title: content.title,
          text: content.text,
          icon,
          callback: () => dispatch(openInformationCenter("announcement")),
        });
      }
    },
    [pushToast, dispatch, startDate],
  );

  const onAnnouncementRead = useCallback(
    (announcement: Announcement) => {
      // eslint-disable-next-line camelcase
      const { uuid, utm_campaign } = announcement;

      track("Announcement Viewed", {
        uuid,
        utm_campaign,
      });

      dismissToast(uuid);
    },
    [dismissToast],
  );

  const autoUpdateDelay = process.env.PLAYWRIGHT_RUN || process.env.MOCK ? 16 : 60000;

  return (
    <AnnouncementProvider
      autoUpdateDelay={autoUpdateDelay}
      context={context}
      onNewAnnouncement={onNewAnnouncement}
      onAnnouncementRead={onAnnouncementRead}
      handleLoad={loadAnnouncements}
      handleSave={saveAnnouncements}
      fetchApi={notificationsApi}
    >
      <ServiceStatusProvider
        context={{ tickers }}
        autoUpdateDelay={autoUpdateDelay}
        networkApi={serviceStatusApi}
      >
        {children}
      </ServiceStatusProvider>
    </AnnouncementProvider>
  );
}
