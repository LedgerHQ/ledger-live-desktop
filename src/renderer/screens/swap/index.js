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
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import { rgba } from "~/renderer/styles/helpers";

const RatesChangeNoticeWrapper = styled(Box).attrs(() => ({
  p: 3,
  mb: 4,
  horizontal: true,
}))`
  align-items: center;
  border-radius: 4px;
  background-color: ${p => rgba(p.theme.colors.warning, 0.1)};
`;

const SwapOrSwapHistory = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();

  const [showRateChangedNotice, setShowRateChanged] = useState(false);
  const onIndexChange = useCallback(index => {
    setTabIndex(index);
    setShowRateChanged(false);
  }, []);

  return (
    <Box>
      <TrackPage category="Swap" />
      {showRateChangedNotice ? (
        <RatesChangeNoticeWrapper color="warning" flow={4}>
          <ExclamationCircleThin size={16} />
          <Box ml={2} flex={1} alignItems={"flex-start"}>
            <Text ff="Inter|Regular" textAlign="center" fontSize={4}>
              <Trans i18nKey="swap.form.warning" />
            </Text>
          </Box>
        </RatesChangeNoticeWrapper>
      ) : null}
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
      {tabIndex === 0 ? (
        <Swap {...location?.state} setShowRateChanged={setShowRateChanged} />
      ) : (
        <History />
      )}
    </Box>
  );
};

export default SwapOrSwapHistory;
