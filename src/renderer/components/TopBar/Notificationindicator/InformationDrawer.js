// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TabBar from "~/renderer/components/TabBar";

export const InformationDrawer = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean,
  onRequestClose: () => void,
}) => {

  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <SideDrawer paper isOpen={isOpen} onRequestClose={onRequestClose} direction="left">
      <Box py={60}>
        <TabBar
          tabs={["swap.tabs.exchange", "swap.tabs.history"]}
          onIndexChange={setTabIndex}
          index={tabIndex}
        />
      </Box>
    </SideDrawer>
  );
};
