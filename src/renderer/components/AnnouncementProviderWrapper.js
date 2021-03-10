// @flow
import React, { useCallback } from "react";
import { AnnouncementProvider } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider";
import type { Announcement } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider/types";
import { getKey, setKey } from "~/renderer/storage";
import { languageSelector } from "~/renderer/reducers/settings";
import { currenciesIdSelector } from "~/renderer/reducers/accounts";
import { useSelector, useDispatch } from "react-redux";
import { ServiceStatusProvider } from "@ledgerhq/live-common/lib/providers/ServiceStatusProvider";
import { useToasts } from "@ledgerhq/live-common/lib/providers/ToastProvider/index";
import { openInformationCenter } from "~/renderer/actions/UI";

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
  const dispatch = useDispatch();

  const { pushToast, dismissToast } = useToasts();

  const context = {
    language,
    currencies,
    getDate: () => new Date(),
  };

  const onNewAnnouncement = useCallback(
    (announcement: Announcement) => {
      const { uuid, content, icon } = announcement;

      pushToast({
        id: uuid,
        type: "announcement",
        title: content.title,
        text: content.text,
        icon,
        callback: () => dispatch(openInformationCenter("announcement")),
      });
    },
    [pushToast, dispatch],
  );

  const onAnnouncementRead = useCallback(
    (announcement: Announcement) => {
      const { uuid } = announcement;
      console.log("ANNOUNCEMENT READ ", uuid)
      dismissToast(uuid);
    },
    [dismissToast],
  );

  return (
    <AnnouncementProvider
      autoUpdateDelay={15000}
      context={context}
      onNewAnnouncement={onNewAnnouncement}
      onAnnouncementRead={onAnnouncementRead}
      handleLoad={loadAnnouncements}
      handleSave={saveAnnouncements}
    >
      <ServiceStatusProvider autoUpdateDelay={15000}>{children}</ServiceStatusProvider>
    </AnnouncementProvider>
  );
}
