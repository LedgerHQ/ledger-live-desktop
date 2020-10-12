// @flow
import React, { useCallback, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import RequestAmount from "~/renderer/components/RequestAmount";
import Switch from "~/renderer/components/Switch";
import Text from "~/renderer/components/Text";

type Props = {
  parentAccount: ?Account,
  account: AccountLike,
  transaction: Transaction,
  onChangeTransaction: (*) => void,
  status: TransactionStatus,
  bridgePending: boolean,
  t: TFunction,
  initValue?: BigNumber,
  resetInitValue?: () => void,
};

const AmountField = ({
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  status,
  bridgePending,
  t,
  initValue,
  resetInitValue,
}: Props) => {
  const bridge = getAccountBridge(account, parentAccount);

  useEffect(() => {
    if (initValue && !initValue.eq(transaction.amount || BigNumber(0))) {
      onChangeTransaction(bridge.updateTransaction(transaction, { amount: initValue }));
      resetInitValue && resetInitValue();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = useCallback(
    (amount: BigNumber) => {
      onChangeTransaction(bridge.updateTransaction(transaction, { amount }));
    },
    [bridge, transaction, onChangeTransaction],
  );

  const onChangeSendMax = useCallback(
    (useAllAmount: boolean) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, { useAllAmount, amount: BigNumber(0) }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  if (!status) return null;
  const { useAllAmount } = transaction;
  const { amount, errors, warnings } = status;
  let { amount: amountError } = errors;
  let { amount: amountWarning } = warnings;

  // we ignore zero case for displaying field error because field is empty.
  if (amount.eq(0) && (bridgePending || !useAllAmount)) {
    amountError = null;
    amountWarning = null;
  }

  return (
    <Box flow={1}>
      <Box
        horizontal
        alignItems="center"
        justifyContent="space-between"
        style={{ width: "50%", paddingRight: 28 }}
      >
        <Label>{t("send.steps.details.amount")}</Label>
        {typeof useAllAmount === "boolean" ? (
          <Box horizontal alignItems="center">
            <Text
              color="palette.text.shade40"
              ff="Inter|Medium"
              fontSize={10}
              style={{ paddingRight: 5 }}
              onClick={() => onChangeSendMax(!useAllAmount)}
            >
              <Trans i18nKey="send.steps.details.useMax" />
            </Text>
            <Switch small isChecked={useAllAmount} onChange={onChangeSendMax} />
          </Box>
        ) : null}
      </Box>
      <RequestAmount
        disabled={!!useAllAmount}
        account={account}
        validTransactionError={amountError}
        validTransactionWarning={amountWarning}
        onChange={onChange}
        value={amount}
        showCountervalue={false}
        autoFocus={!initValue}
      />
    </Box>
  );
};

export default AmountField;
