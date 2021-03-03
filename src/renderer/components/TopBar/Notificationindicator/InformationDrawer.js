// @flow

import React, { useState, useMemo } from "react";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import TabBar from "~/renderer/components/TabBar";
import { AnnouncementPanel } from "~/renderer/components/TopBar/Notificationindicator/AnnouncementPanel";
import { ServiceStatusPanel } from "~/renderer/components/TopBar/Notificationindicator/ServiceStatusPanel";

import { useTranslation } from "react-i18next";
import { useAnnouncements } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider";
import { CSSTransition } from "react-transition-group";

const FADE_DURATION = 200;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;

  &.information-panel-switch-appear {
    opacity: 0;
  }

  &.information-panel-switch-appear-active {
    opacity: 1;
    transition: opacity ${FADE_DURATION}ms ease-in;
  }
`;

export const InformationDrawer = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean,
  onRequestClose: () => void,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();
  const { allIds, seenIds } = useAnnouncements();
  const unseenCount = allIds.length - seenIds;

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
        Component: AnnouncementPanel,
      },
      {
        id: "status",
        label: t("informationCenter.tabs.serviceStatus"),
        Component: ServiceStatusPanel,
      },
    ],
    [unseenCount],
  );

  const CurrentPanel = tabs[tabIndex].Component;

  return (
    <SideDrawer paper isOpen={isOpen} onRequestClose={onRequestClose} direction="left">
      <Box pt="60px" height="100%">
        <TabBar
          fullWidth
          tabs={tabs.map(({ label }) => label)}
          onIndexChange={setTabIndex}
          index={tabIndex}
        />
        <CSSTransition
          in
          appear
          key={tabIndex}
          timeout={FADE_DURATION}
          classNames="information-panel-switch"
        >
          <PanelContainer>
            <CurrentPanel key={tabs[tabIndex].id} />
          </PanelContainer>
        </CSSTransition>
      </Box>
    </SideDrawer>
  );
};
