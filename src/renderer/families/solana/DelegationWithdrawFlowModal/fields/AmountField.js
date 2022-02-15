// @flow

import React, { useCallback } from "react";
import invariant from "invariant";
import styled from "styled-components";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import InputCurrency from "~/renderer/components/InputCurrency";
import Box from "~/renderer/components/Box";
import GenericContainer from "~/renderer/components/FeesContainer";
import { BigNumber } from "bignumber.js";

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
};

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter",
  color: "palette.text.shade80",
  fontSize: 4,
  justifyContent: "center",
  pr: 3,
}))``;

export default function AmountField({ account, transaction, status }: Props) {
  invariant(transaction.family === "solana", "AmountField: solana family expected");

  const defaultUnit = getAccountUnit(account);

  return (
    <InputCurrency
      disabled
      error={status.errors.amount}
      defaultUnit={defaultUnit}
      renderRight={<InputRight>{defaultUnit.code}</InputRight>}
      containerProps={{ grow: true }}
      value={transaction.amount}
      onChange={() => {}}
    />
  );
}
