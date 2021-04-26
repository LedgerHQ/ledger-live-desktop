// @flow

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import Card from "~/renderer/components/Box/Card";
import Swap from "~/renderer/screens/exchange/swap/Swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import History from "~/renderer/screens/exchange/swap/History";

import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";

const DebugTabContent = props => (
  <Card grow style={{ overflow: "hidden" }}>
    <WebPlatformPlayer platform="debug" />
  </Card>
);
const ParaswapTabContent = props => (
  <Card grow style={{ overflow: "hidden" }}>
    <WebPlatformPlayer platform="paraswap" />
  </Card>
);

const ExchangeTabContent = props => <Swap {...props} />;
const HistoryTabContent = props => <History />;

const tabs = [
  {
    title: "Debug",
    Component: DebugTabContent,
  },
  {
    title: "Paraswap",
    Component: ParaswapTabContent,
  },
  {
    title: <Trans i18nKey="swap.tabs.exchange" />,
    Component: ExchangeTabContent,
  },
  {
    title: <Trans i18nKey="swap.tabs.history" />,
    Component: HistoryTabContent,
  },
];

const SwapOrSwapHistory = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();

  const Component = tabs[tabIndex].Component;

  return (
    <Box flex={1} pb={6}>
      <TrackPage category="Swap" />
      <Box horizontal>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <TabBar tabs={tabs.map(tab => tab.title)} onIndexChange={setTabIndex} index={tabIndex} />
      <Component {...location?.state} setTabIndex={setTabIndex} />
    </Box>
  );
};

export default SwapOrSwapHistory;
