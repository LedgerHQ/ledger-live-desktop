import React, { useMemo } from "react";
import { Drawer } from "@ledgerhq/react-ui";
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
        label: t(
          unseenCount > 0
            ? "informationCenter.tabs.announcementsUnseen"
            : "informationCenter.tabs.announcements",
          { unseenCount },
        ),
        Component: <AnnouncementPanel />,
      },
      {
        id: "status",
        label: t(
          incidentCount > 0
            ? "informationCenter.tabs.serviceStatusIncidentsOngoing"
            : "informationCenter.tabs.serviceStatus",
          { incidentCount },
        ),
        Component: <ServiceStatusPanel />,
      },
    ],
    [unseenCount, t, incidentCount],
  );

  const tabIndex = useMemo(() => tabs.findIndex(tab => tab.id === tabId), [tabId, tabs]);

  return (
    <Drawer isOpen={isOpen} onClose={onRequestClose}>
      <Flex my="20px" justifyContent="center">
        <Logos.LedgerLiveRegular />
      </Flex>
      <Tabs
        tabs={tabs.map(({ label, Component }, i) => ({
          index: i,
          title: label,
          Component,
        }))}
        activeIndex={tabIndex}
        onTabChange={newTabIndex => {
          dispatch(setTabInformationCenter(tabs[newTabIndex].id));
        }}
      />
    </Drawer>
  );
};

export default InformationDrawer;
