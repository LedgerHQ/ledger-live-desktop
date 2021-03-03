// @flow

import Tooltip from "~/renderer/components/Tooltip";
import React, { useState } from "react";
import ItemContainer from "../ItemContainer";
import IconBell from "~/renderer/icons/Bell";
import { useAnnouncements } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider";
import { useTranslation } from "react-i18next";
import { InformationDrawer } from "./InformationDrawer";

export function NotificationIndicator() {
  const { t } = useTranslation();
  const { allIds, seenIds } = useAnnouncements();

  const totalNotifCount = allIds.length - seenIds;

  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <InformationDrawer isOpen={isOpen} onRequestClose={() => setOpen(false)} />
      <Tooltip content={t("informationCenter.tooltip")} placement="bottom">
        <ItemContainer
          id="topbar-notification-button"
          isInteractive
          onClick={() => {
            setOpen(true);
          }}
        >
          <IconBell size={16} dot={totalNotifCount > 0} />
        </ItemContainer>
      </Tooltip>
    </>
  );
}
