// @flow
import React from "react";
import { AnnouncementProvider } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider";
import type { Announcement } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider/types";
import { getKey, setKey } from "~/renderer/storage";
import { languageSelector } from "~/renderer/reducers/settings";
import { currenciesIdSelector } from "~/renderer/reducers/accounts";
import { useSelector } from "react-redux";
import { ServiceStatusProvider } from "@ledgerhq/live-common/lib/providers/ServiceStatusProvider";

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
  const data = await getKey("app", "announcements", []);
  return data;
}

export function AnnouncementProviderWrapper({ children }: Props) {
  const language = useSelector(languageSelector);
  const currencies = useSelector(currenciesIdSelector);

  const context = {
    language,
    currencies,
    getDate: () => new Date(),
  };

  return (
    <AnnouncementProvider
      autoUpdateDelay={15000}
      context={context}
      handleLoad={loadAnnouncements}
      handleSave={saveAnnouncements}
    >
      <ServiceStatusProvider autoUpdateDelay={15000}>{children}</ServiceStatusProvider>
    </AnnouncementProvider>
  );
}
