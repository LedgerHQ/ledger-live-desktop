// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import type { AccountLikeArray, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";
import { isCompoundTokenSupported } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import OperationsList from "~/renderer/components/OperationsList";
import EmptyState from "../EmptyState";

type Props = {
  navigateToCompoundDashboard: () => void,
  accounts: AccountLikeArray,
  summaries: CompoundAccountSummary[],
};

const History = ({ navigateToCompoundDashboard, accounts, summaries }: Props) => {
  const { t } = useTranslation();

  const filterOperation = (op: Operation, acc: AccountLike) => {
    if (acc.type !== "TokenAccount") return false;
    const ctoken = findCompoundToken(acc.token);
    if (!ctoken) return false;
    return isCompoundTokenSupported(ctoken) && ["REDEEM", "SUPPLY"].includes(op.type);
  };

  return (
    <Box>
      <TrackPage category="Lend" name="History" />
      {summaries.length ? (
        <OperationsList accounts={accounts} filterOperation={filterOperation} />
      ) : (
        <EmptyState
          title={t("lend.emptyState.history.title")}
          description={t("lend.emptyState.history.description")}
          buttonLabel={t("lend.emptyState.history.cta")}
          onClick={navigateToCompoundDashboard}
        />
      )}
    </Box>
  );
};

export default History;
