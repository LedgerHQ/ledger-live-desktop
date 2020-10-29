// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import { BigNumber } from "bignumber.js";

import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { TFunction } from "react-i18next";
import type { Account, TokenAccount, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";

import Label from "~/renderer/components/Label";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Text from "~/renderer/components/Text";
import Switch from "~/renderer/components/Switch";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  alignItems: "center",
  horizontal: true,
}))`
  padding: ${p => p.theme.space[2]}px;
`;

type Props = {
  t: TFunction,
  account: ?TokenAccount,
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
  const capabilities = makeCompoundSummaryForAccount(account, parentAccount);

  const onChange = useCallback(
    (value: BigNumber) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          useAllAmount: false,
          amount: value,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  const onChangeSendMax = useCallback(
    (useAllAmount: boolean) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          useAllAmount,
          amount: useAllAmount ? BigNumber(0) : capabilities?.totalSupplied || BigNumber(0),
        }),
      );
    },
    [bridge, transaction, onChangeTransaction, capabilities],
  );

  if (!status) return null;
  const { errors, warnings } = status;
  const { amount } = errors;
  const { useAllAmount, amount: txAmount } = transaction;

  return (
    <Box flow={1}>
      <Label>
        <Text style={{ flex: 1 }} textAlign="left">
          <Trans i18nKey="lend.withdraw.steps.amount.amountToWithdraw">
            <b></b>
          </Trans>
        </Text>

        {typeof useAllAmount === "boolean" ? (
          <Box horizontal alignItems="center">
            <Text
              color="palette.text.shade40"
              ff="Inter|Medium"
              fontSize={10}
              style={{ paddingRight: 5 }}
              onClick={() => onChangeSendMax(!useAllAmount)}
            >
              <Trans i18nKey="lend.withdraw.steps.amount.withdrawAll" />
            </Text>
            <Switch small isChecked={useAllAmount} onChange={onChangeSendMax} />
          </Box>
        ) : null}
      </Label>
      <InputCurrency
        disabled={!!useAllAmount}
        autoFocus={false}
        error={amount}
        warning={warnings.amount}
        containerProps={{ grow: true }}
        defaultUnit={defaultUnit}
        value={txAmount}
        onChange={onChange}
        placeholder={useAllAmount ? t("lend.withdraw.steps.amount.placeholder") : null}
        renderRight={<InputRight>{defaultUnit.code}</InputRight>}
      />
    </Box>
  );
};

export default AmountField;
