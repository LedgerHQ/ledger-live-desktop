// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { listCurrentRates } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { useCompoundSummaries } from "./useCompoundSummaries";
import { flattenSortAccountsSelector } from "~/renderer/actions/general";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import TabBar from "~/renderer/components/TabBar";

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
  const accounts = useSelector(flattenSortAccountsSelector);
  const summaries = useCompoundSummaries(accounts);

  const Component = tabs[activeTabIndex].component;

  const rates = listCurrentRates();

  console.log({ rates });

  return (
    <Box>
      <TrackPage category="Lend" />
      <Box style={{ paddingBottom: 32 }}>
        <Box grow ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="lend-title">
          {t("lend.title")}
        </Box>
        <Box mt={2} grow ff="Inter|Medium" fontSize={3} color="palette.text.shade50" id="lend-desc">
          {t("lend.description")}
        </Box>
      </Box>

      <TabBar tabs={tabs.map(tab => t(tab.title))} onIndexChange={setActiveTabIndex} short />

      <Box mt={4}>
        <Component accounts={accounts} summaries={summaries} />
      </Box>
    </Box>
  );
};

export default Lend;
