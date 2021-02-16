// @flow
import React from "react";
import { AnnoucementProvider } from "@ledgerhq/live-common/lib/announcements/react";
import type { Announcement } from "@ledgerhq/live-common/lib/announcements/types";
import { getKey, setKey } from "~/renderer/storage";
import { languageSelector } from "~/renderer/reducers/settings";
import { currenciesIdSelector } from "~/renderer/reducers/accounts";
import { useSelector } from "react-redux";

type Props = {
  children: React$Node,
};

async function saveAnnouncements({
  announcements,
  seenIds,
}: {
  announcements: Announcement[],
  seenIds: string[],
}) {
  console.log("SAVING ANN: ", { announcements, seenIds });
  setKey("app", "announcements", {
    announcements,
    seenIds,
  });
}

async function loadAnnouncements(): Promise<{
  announcements: Announcement[],
  seenIds: string[],
}> {
  const data = await getKey("app", "announcements", []);
  console.log("LOADING ANN: ", data);

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
    <AnnoucementProvider context={context} onLoad={loadAnnouncements} onSave={saveAnnouncements}>
      {children}
    </AnnoucementProvider>
  );
}
