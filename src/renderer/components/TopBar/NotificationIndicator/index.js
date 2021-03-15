// @flow

import Tooltip from "~/renderer/components/Tooltip";
import React from "react";
import ItemContainer from "../ItemContainer";
import IconBell from "~/renderer/icons/Bell";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { useTranslation } from "react-i18next";
import { InformationDrawer } from "./InformationDrawer";
import { useDispatch, useSelector } from "react-redux";
import { informationCenterStateSelector } from "~/renderer/reducers/UI";
import { openInformationCenter, closeInformationCenter } from "~/renderer/actions/UI";

export function NotificationIndicator() {
  const { t } = useTranslation();
  const { allIds, seenIds } = useAnnouncements();

  const totalNotifCount = allIds.length - seenIds.length;
  const { isOpen } = useSelector(informationCenterStateSelector);
  const dispatch = useDispatch();

  return (
    <>
      <InformationDrawer
        isOpen={isOpen}
        onRequestClose={() => dispatch(closeInformationCenter())}
      />
      <Tooltip content={t("informationCenter.tooltip")} placement="bottom">
        <ItemContainer
          id="topbar-notification-button"
          isInteractive
          onClick={() => {
            dispatch(openInformationCenter());
          }}
        >
          <IconBell size={16} dot={totalNotifCount > 0} />
        </ItemContainer>
      </Tooltip>
    </>
  );
}
