// @flow

import Tooltip from "~/renderer/components/Tooltip";
import React, { useEffect, useState } from "react";
import ItemContainer from "../ItemContainer";
import IconEyeOff from "~/renderer/icons/EyeOff";
import { useAnnouncements } from "@ledgerhq/live-common/lib/announcements/react";
import { useTranslation } from "react-i18next";
import { InformationDrawer } from "./InformationDrawer";

export function NotificationIndicator() {
  const { t } = useTranslation();
  const { updateCache } = useAnnouncements();

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setInterval(() => {
      updateCache();
    }, 15000);
  }, [updateCache]);

  return (
    <>
      <InformationDrawer isOpen={isOpen} onRequestClose={() => setOpen(false)} />
      <Tooltip content={t("settings.discreet")} placement="bottom">
        <ItemContainer
          id="topbar-notification-button"
          isInteractive
          onClick={() => {
            setOpen(true);
          }}
        >
          <IconEyeOff size={16} />
        </ItemContainer>
      </Tooltip>
    </>
  );
}
