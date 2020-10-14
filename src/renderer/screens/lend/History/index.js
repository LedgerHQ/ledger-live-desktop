// @flow
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { AccountLikeArray, Operation } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import OperationsList from "~/renderer/components/OperationsList";
import EmptyState from "../EmptyState";

type Props = {
  navigateToCompoundDashboard: () => void,
  accounts: AccountLikeArray,
};

const useCompoundHistory = (accounts: AccountLikeArray): AccountLikeArray => {
  const filterOps = (op: Operation): boolean => ["REDEEM", "SUPPLY"].includes(op.type);
  const history = useMemo(
    () =>
      accounts.map(acc => {
        const operations = acc.operations.filter(filterOps);
        console.log(operations);
        return {
          ...acc,
          operations,
        };
      }),
    [accounts],
  );

  return history;
};

const History = ({ navigateToCompoundDashboard, accounts }: Props) => {
  const { t } = useTranslation();
  const history = useCompoundHistory(accounts);

  return (
    <Box>
      {history.length ? (
        <OperationsList accounts={history} />
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
