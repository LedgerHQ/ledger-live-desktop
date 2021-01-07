// @flow

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import { isAccountBalanceUnconfirmed } from "@ledgerhq/live-common/lib/account";
import { accountsSelector } from "./../reducers/accounts";
import IconClock from "~/renderer/icons/Clock";
import ToolTip from "~/renderer/components/Tooltip";
import Box from "~/renderer/components/Box";

const TransactionsPendingConfirmationWarning = ({
  maybeAccount,
}: {
  maybeAccount?: AccountLike,
}) => {
  let accounts = useSelector(accountsSelector);
  accounts = maybeAccount ? [maybeAccount] : accounts;
  const { t } = useTranslation();
  const content = (
    <Box p={1} style={{ maxWidth: 230 }}>
      {t("dashboard.transactionsPendingConfirmation")}
    </Box>
  );
  return accounts.some(isAccountBalanceUnconfirmed) ? (
    <ToolTip content={content}>
      <Box px={1} justifyContent={"center"}>
        <IconClock size={16} />
      </Box>
    </ToolTip>
  ) : null;
};

export default TransactionsPendingConfirmationWarning;
