// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import { BigNumber } from "bignumber.js";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { TFunction } from "react-i18next";

import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";

import type { Transaction } from "@ledgerhq/live-common/lib/families/tron/types";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Text from "~/renderer/components/Text";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
}))`
  padding: ${p => p.theme.space[2]}px;
`;

const AmountButton: ThemedComponent<{ error: boolean }> = styled.button.attrs(() => ({
  type: "button",
}))`
  background-color: ${p =>
    p.error ? p.theme.colors.lightRed : p.theme.colors.palette.action.hover};
  color: ${p => p.theme.colors.palette.primary.main};
  border: none;
  border-radius: 4px;
  padding: 0px ${p => p.theme.space[2]}px;
  margin: 0 2.5px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 200ms ease-out;
  &:hover,
  &:focus {
    filter: brightness(0.8);
  }
`;

const getDecimalPart = (value: BigNumber, magnitude: number) =>
  value.minus(value.modulo(10 ** magnitude));

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
  invariant(account && transaction && account.spendableBalance, "account and transaction required");

  const bridge = getAccountBridge(account, parentAccount);

  const defaultUnit = getAccountUnit(account);
  const { spendableBalance } = account;

  const onChange = useCallback(
    (value: BigNumber) =>
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          amount: getDecimalPart(value, defaultUnit.magnitude),
        }),
      ),
    [bridge, transaction, onChangeTransaction, defaultUnit],
  );

  const amountAvailable = useMemo(
    () =>
      formatCurrencyUnit(defaultUnit, getDecimalPart(spendableBalance, defaultUnit.magnitude), {
        disableRounding: true,
        showAllDigits: false,
        showCode: true,
      }),
    [spendableBalance, defaultUnit],
  );

  /** show amount ratio buttons only if we can ratio the available assets to 25% or less */
  const showAmountRatio = useMemo(
    () => spendableBalance.gt(BigNumber(4 * 10 ** defaultUnit.magnitude)),
    [spendableBalance, defaultUnit],
  );

  const amountButtons = useMemo(
    () =>
      showAmountRatio && [
        {
          label: "25%",
          value: spendableBalance.multipliedBy(0.25),
        },
        {
          label: "50%",
          value: spendableBalance.multipliedBy(0.5),
        },
        {
          label: "75%",
          value: spendableBalance.multipliedBy(0.75),
        },
        {
          label: "100%",
          value: spendableBalance,
        },
      ],
    [showAmountRatio, spendableBalance],
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
      <Box
        horizontal
        justifyContent="space-between"
        alignItems="center"
        color="palette.text.shade80"
      >
        <Text fontSize={3}>
          <Trans i18nKey="freeze.steps.amount.amountLabel" />
        </Text>
        <Text fontSize={3} textAlign="right">
          <Trans i18nKey="freeze.steps.amount.available" values={{ amountAvailable }} />
        </Text>
      </Box>
      <InputCurrency
        autoFocus={false}
        error={amountError}
        warning={warnings.amount}
        containerProps={{ grow: true }}
        defaultUnit={defaultUnit}
        value={amount}
        decimals={0}
        onChange={onChange}
        renderRight={
          showAmountRatio && (
            <InputRight>
              {amountButtons.map(({ label, value }, key) => (
                <AmountButton key={key} error={!!amountError} onClick={() => onChange(value)}>
                  {label}
                </AmountButton>
              ))}
            </InputRight>
          )
        }
      />
    </Box>
  );
};

export default AmountField;
