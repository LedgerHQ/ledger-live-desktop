import React, { useMemo } from "react";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import { Flex, Tabs, Logos } from "@ledgerhq/react-ui";
import AnnouncementPanel from "./AnnouncementPanel";
import ServiceStatusPanel from "./ServiceStatusPanel";

import { useTranslation } from "react-i18next";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { useSelector, useDispatch } from "react-redux";
import { informationCenterStateSelector } from "~/renderer/reducers/UI";
import { setTabInformationCenter } from "~/renderer/actions/UI";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/index";

const InformationDrawer = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) => {
  const { t } = useTranslation();
  const { allIds, seenIds } = useAnnouncements();
  const { incidents } = useFilteredServiceStatus();
  const unseenCount = allIds.length - seenIds.length;
  const incidentCount = incidents.length;
  const { tabId } = useSelector(informationCenterStateSelector);
  const dispatch = useDispatch();

  const tabs = useMemo(
    () => [
      {
        id: "announcement",
        title: t("informationCenter.tabs.announcements"),
        badge: unseenCount || undefined,
        Component: <AnnouncementPanel />,
      },
      {
        id: "status",
        title: t("informationCenter.tabs.serviceStatus"),
        badge: unseenCount || undefined,
        Component: <ServiceStatusPanel />,
      },
    ],
    [unseenCount, t, incidentCount],
  );

  const tabIndex = useMemo(() => tabs.findIndex(tab => tab.id === tabId), [tabId, tabs]);

  return (
    <SideDrawer isOpen={isOpen} onClose={onRequestClose} big>
      <Flex my="20px" justifyContent="center">
        <Logos.LedgerLiveRegular />
      </Flex>
      <Tabs
        tabs={tabs.map(({ title, Component, badge }, index) => ({
          index,
          title,
          badge,
          Component,
        }))}
        activeIndex={tabIndex}
        onTabChange={newTabIndex => {
          dispatch(setTabInformationCenter(tabs[newTabIndex].id));
        }}
      />
    </SideDrawer>
  );
};

export default InformationDrawer;
