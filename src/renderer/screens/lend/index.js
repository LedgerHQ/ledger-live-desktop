// @flow

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { listCurrentRates } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useFlattenSortAccounts } from "~/renderer/actions/general";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import TabBar from "~/renderer/components/TabBar";
import { prepareCurrency } from "~/renderer/bridge/cache";
import { useCompoundSummaries } from "./useCompoundSummaries";

import Dashboard from "./Dashboard";
import Closed from "./Closed";
import History from "./History";

const tabs = [
  {
    title: "lend.tabs.dashboard",
    component: Dashboard,
  },
  {
    title: "lend.tabs.closed",
    component: Closed,
  },
  {
    title: "lend.tabs.history",
    component: History,
  },
];

const Lend = () => {
  const { t } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const accounts = useFlattenSortAccounts();
  const summaries = useCompoundSummaries(accounts);
  const [rates, setRates] = useState(() => listCurrentRates());

  const Component = tabs[activeTabIndex].component;

  useEffect(() => {
    prepareCurrency(getCryptoCurrencyById("ethereum")).then(() => {
      const newRates = listCurrentRates();
      setRates(newRates);
    });
  }, []);

  const navigateToCompoundDashboard = useCallback(() => setActiveTabIndex(0), [setActiveTabIndex]);

  return (
    <Box>
      <TrackPage category="Lend" />
      <Box style={{ paddingBottom: 32 }}>
        <Box grow ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="lend-title">
          {t("lend.title")}
        </Box>
      </Box>

      <TabBar
        index={activeTabIndex}
        tabs={tabs.map(tab => t(tab.title))}
        onIndexChange={setActiveTabIndex}
        short
      />

      <Box mt={4}>
        <Component
          accounts={accounts}
          summaries={summaries}
          rates={rates}
          navigateToCompoundDashboard={navigateToCompoundDashboard}
        />
      </Box>
    </Box>
  );
};

export default Lend;
