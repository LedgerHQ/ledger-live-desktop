// @flow

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TabBar from "~/renderer/components/TabBar";
import Swap from "~/renderer/screens/exchange/swap/Swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans, useTranslation } from "react-i18next";
import History from "~/renderer/screens/exchange/swap/History";

const FormOrHistory = ({ provider }: { provider: string }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const { t } = useTranslation();

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
      <TabBar
        tabs={[t("swap.tabs.exchange"), t("swap.tabs.history")]}
        onIndexChange={setTabIndex}
        index={tabIndex}
      />
      {tabIndex === 0 ? (
        <Swap {...location?.state} setTabIndex={setTabIndex} provider={provider} />
      ) : (
        <History provider={provider} />
      )}
    </Box>
  );
};

export default FormOrHistory;
