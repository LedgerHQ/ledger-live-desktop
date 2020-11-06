// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { BigNumber } from "bignumber.js";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { TFunction } from "react-i18next";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/polkadot/types";

import { localeSelector } from "~/renderer/reducers/settings";
import Label from "~/renderer/components/Label";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Text from "~/renderer/components/Text";

const InputLeft = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
  pl: 3,
}))``;

type Props = {
  t: TFunction,
  account: ?Account,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  bridgePending: boolean,
};

const AmountField = ({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: Props) => {
  const locale = useSelector(localeSelector);
  invariant(account && transaction && account.spendableBalance, "account and transaction required");

  const bridge = getAccountBridge(account, parentAccount);

  const defaultUnit = getAccountUnit(account);
  const { spendableBalance } = account;

  const onChange = useCallback(
    (value: BigNumber) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          amount: value,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  const amountAvailable = useMemo(
    () =>
      formatCurrencyUnit(defaultUnit, spendableBalance, {
        disableRounding: true,
        showAllDigits: false,
        showCode: true,
        locale,
      }),
    [spendableBalance, defaultUnit, locale],
  );

  if (!status) return null;
  const { amount, errors, warnings } = status;
  let { amount: amountError } = errors;

  // we ignore zero case for displaying field error because field is empty.
  if (amount.eq(0)) {
    amountError = null;
  }

  return (
    <Box vertical flow={1}>
      <Label>
        <Text>
          <Trans i18nKey="polkadot.bond.steps.amount.amountLabel" />
        </Text>
        <Text style={{ flex: 1 }} textAlign="right">
          <Trans i18nKey="polkadot.bond.steps.amount.available" values={{ amountAvailable }} />
        </Text>
      </Label>
      <InputCurrency
        autoFocus={false}
        error={amountError}
        warning={warnings.amount}
        containerProps={{ grow: true }}
        defaultUnit={defaultUnit}
        value={amount}
        onChange={onChange}
        renderLeft={<InputLeft>{defaultUnit.code}</InputLeft>}
        renderRight={false}
      />
    </Box>
  );
};

export default AmountField;
