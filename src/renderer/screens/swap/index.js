// @flow

import React, { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { StickyTabBar } from "~/renderer/screens/manager/AppsList/AppsList";
import TabBar from "~/renderer/components/TabBar";
import Swap from "~/renderer/screens/swap/Swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import History from "~/renderer/screens/swap/History";

const SwapOrSwapHistory = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();

  const onIndexChange = useCallback(index => {
    setTabIndex(index);
  }, []);

  return (
    <Box>
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

      <StickyTabBar>
        <TabBar tabs={["swap.tabs.exchange", "swap.tabs.history"]} onIndexChange={onIndexChange} />
      </StickyTabBar>
      {tabIndex === 0 ? <Swap {...location?.state} /> : <History />}
    </Box>
  );
};

export default SwapOrSwapHistory;
