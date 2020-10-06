// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import type { CurrentRate } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import EmptyState from "./EmptyState";
import ActiveAccounts from "./ActiveAccounts";
import Rates from "./Rates";

const Dashboard = ({
  summaries,
  rates,
}: {
  summaries: CompoundAccountSummary[],
  rates: CurrentRate[],
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text ff="Inter|SemiBold" color="palette.text.shade100">
        {t("lend.assets")}
      </Text>
      <Box my={4}>
        <Rates rates={rates} />
      </Box>
      <Text ff="Inter|SemiBold" color="palette.text.shade100">
        {t("lend.active")}
      </Text>
      <Box my={4}>
        {summaries.length > 0 ? <ActiveAccounts summaries={summaries} /> : <EmptyState />}
      </Box>
    </Box>
  );
};

export default Dashboard;
