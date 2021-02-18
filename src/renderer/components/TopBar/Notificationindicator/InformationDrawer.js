// @flow

import React, { useState } from "react";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import TabBar from "~/renderer/components/TabBar";
import { AnnouncementPanel } from "~/renderer/components/TopBar/Notificationindicator/AnnouncementPanel";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";

const PanelContainer = styled(ScrollArea)`
  flex: 1;
`;

export const InformationDrawer = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean,
  onRequestClose: () => void,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <SideDrawer paper isOpen={isOpen} onRequestClose={onRequestClose} direction="left">
      <Box pt="60px" height="100%">
        <TabBar
          fullWidth
          tabs={["informationCenter.tabs.announcements"]}
          onIndexChange={setTabIndex}
          index={tabIndex}
        />
        <PanelContainer hideScrollbar>
          <Box py="32px">{tabIndex === 0 ? <AnnouncementPanel key="announcement" /> : null}</Box>
        </PanelContainer>
      </Box>
    </SideDrawer>
  );
};
