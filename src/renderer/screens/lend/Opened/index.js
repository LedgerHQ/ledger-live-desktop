// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import { makeOpenedHistoryForAccounts } from "@ledgerhq/live-common/lib/compound/logic";
import type { AccountLikeArray } from "@ledgerhq/live-common/lib/types";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import EmptyState from "../EmptyState";
import OpenedLoans from "./OpenedLoans";

type Props = {
  accounts: AccountLikeArray,
  summaries: CompoundAccountSummary[],
  navigateToCompoundDashboard: () => void,
};

const Opened = ({ accounts, summaries, navigateToCompoundDashboard }: Props) => {
  const opened = makeOpenedHistoryForAccounts(summaries);
  const { t } = useTranslation();

  return (
    <Box>
      <TrackPage category="Lend" name="Opened Positions" />
      {opened.length > 0 ? (
        <OpenedLoans loans={opened} />
      ) : (
        <EmptyState
          title={t("lend.emptyState.opened.title")}
          description={t("lend.emptyState.opened.description")}
          buttonLabel={t("lend.emptyState.opened.cta")}
          onClick={navigateToCompoundDashboard}
        />
      )}
    </Box>
  );
};

export default Opened;
