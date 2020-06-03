// @flow
import React, { useState } from "react";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TabBar from "~/renderer/components/TabBar";
import Card from "~/renderer/components/Box/Card";
import { useTranslation } from "react-i18next";
import Buy from "./Buy";
import History from "./History";

const Container: ThemedComponent<{ selectable: boolean, pb: number }> = styled(Box)`
  flex: 1;
  display: flex;
`;

const tabs = [
  {
    title: "exchange.buy.tab",
    component: <Buy />,
  },
  {
    title: "exchange.history.tab",
    component: <History />,
  },
];

const Exchange = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <Container pb={6} selectable>
      <TrackPage category="Exchange" />
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="exchange-title">
        {t("exchange.title")}
      </Box>
      <TabBar tabs={tabs.map(tab => t(tab.title))} onIndexChange={setActiveTabIndex} />
      <Card grow style={{ overflow: "hidden" }}>
        {tabs[activeTabIndex].component}
      </Card>
    </Container>
  );
};

export default Exchange;
