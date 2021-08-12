// @flow
import React, { useState } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import { useLocation } from "react-router-dom";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TabBar from "~/renderer/components/TabBar";
import Card from "~/renderer/components/Box/Card";
import { useTranslation } from "react-i18next";
import Buy from "./Buy";
import Sell from "./Sell";
import History from "./History";
import { useExchangeProvider } from "./hooks";

const Container: ThemedComponent<{ selectable: boolean, pb: number }> = styled(Box)`
  flex: 1;
  display: flex;
`;

const tabs = [
  {
    header: "exchange.buy.header",
    title: "exchange.buy.tab",
    component: Buy,
  },
  {
    header: "exchange.sell.header",
    title: "exchange.sell.tab",
    component: Sell,
  },
  {
    header: "exchange.title",
    title: "exchange.history.tab",
    component: History,
  },
];

const Exchange = () => {
  const location = useLocation();
  const [provider] = useExchangeProvider();
  const { state } = location;
  const [activeTabIndex, setActiveTabIndex] = useState(state?.tab || 0);
  const { t } = useTranslation();
  const Component = tabs[activeTabIndex].component;

  return (
    <Container pb={6} selectable>
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="exchange-title">
        {t(tabs[activeTabIndex].header, { provider: provider.id })}
      </Box>
      <TabBar
        defaultIndex={activeTabIndex}
        tabs={tabs.map(tab => t(tab.title))}
        onIndexChange={setActiveTabIndex}
      />
      <Card grow style={{ overflow: "hidden" }}>
        <Component {...location?.state} provider={provider} />
      </Card>
    </Container>
  );
};

export default Exchange;
