// @flow

import React from "react";
import { Trans } from "react-i18next";
import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike, TransactionStatus } from "@ledgerhq/live-common/lib/types";

import Box from "~/renderer/components/Box";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import FormattedVal from "~/renderer/components/FormattedVal";
import Label from "~/renderer/components/Label";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  status: TransactionStatus,
};

const AccountFooter = ({ account, parentAccount, status }: Props) => {
  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const accountUnit = getAccountUnit(mainAccount);
  return (
    <>
      <CurrencyCircleIcon size={40} currency={currency} />
      <Box grow>
        <Label>
          <Trans i18nKey="send.footer.estimatedFees" />
        </Label>
        {accountUnit && (
          <FormattedVal
            style={{ width: "auto" }}
            color="palette.text.shade100"
            val={status.estimatedFees}
            unit={accountUnit}
            showCode
          />
        )}
      </Box>
    </>
  );
};

export default AccountFooter;
