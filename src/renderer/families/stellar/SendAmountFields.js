// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import type { Transaction, Account } from "@ledgerhq/live-common/lib/types";

import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import FormattedVal from "~/renderer/components/FormattedVal";

type Props = {
  transaction: Transaction,
  account: Account,
};

function MinimumBalanceField({ transaction, account }: Props) {
  invariant(transaction.family === "stellar", "FeeField: stellar family expected");

  const { baseReserve } = transaction;
  const unit = getAccountUnit(account);

  return (
    <Box horizontal alignItems="center" flow={5}>
      <Box style={{ width: 135 }}>
        <Label>
          <span>Minimum balance :</span>
        </Label>
      </Box>
      <Box grow>
        <FormattedVal
          color={"palette.text.shade80"}
          unit={unit}
          val={baseReserve}
          fontSize={3}
          showCode
        />
      </Box>
    </Box>
  );
}

export default {
  component: MinimumBalanceField,
  fields: ["baseReserve"],
};
