// @flow

import React, { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import Swap from "~/renderer/screens/exchange/swap/Swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import History from "~/renderer/screens/exchange/swap/History";

const SwapOrSwapHistory = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();

  const onIndexChange = useCallback(index => {
    setTabIndex(index);
  }, []);

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
      <TabBar tabs={["swap.tabs.exchange", "swap.tabs.history"]} onIndexChange={onIndexChange} />
      {tabIndex === 0 ? <Swap {...location?.state} /> : <History />}
    </Box>
  );
};

export default SwapOrSwapHistory;
