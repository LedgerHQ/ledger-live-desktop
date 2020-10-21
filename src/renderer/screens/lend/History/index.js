// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { AccountLikeArray, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import OperationsList from "~/renderer/components/OperationsList";
import EmptyState from "../EmptyState";

type Props = {
  navigateToCompoundDashboard: () => void,
  accounts: AccountLikeArray,
};

const History = ({ navigateToCompoundDashboard, accounts }: Props) => {
  const { t } = useTranslation();

  const filterOperation = (op: Operation, acc: AccountLike) =>
    ["REDEEM", "SUPPLY"].includes(op.type);

  return (
    <Box>
      {history.length ? (
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
