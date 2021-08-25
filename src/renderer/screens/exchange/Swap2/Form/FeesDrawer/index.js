// @flow
import { Trans } from "react-i18next";
import styled from "styled-components";
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import SendAmountFields from "~/renderer/modals/Send/SendAmountFields";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  margin-top: 24px;
  margin-bottom: 24px;
`;

export default function FeesDrawer({ swapTransaction, disableSlowStrategy = false }: *) {
  // Drawers are getting initial props but not the updates since the state lives in a separate Component in the hierarchy tree.
  // Hence, this hack - keeping a copy of the transaction and updating both - seems to be needed.
  // TO DIG: Might be a good thing to store swapTransaction in redux.
  const {
    transaction,
    setTransaction: _setTransaction,
    updateTransaction: _updateTransaction,
    account,
    parentAccount,
    status,
  } = useBridgeTransaction(() => ({
    account: swapTransaction.account,
    parentAccount: swapTransaction.parentAccount,
    transaction: swapTransaction.transaction,
  }));

  const updateTransaction = useCallback(
    (...args) => {
      _updateTransaction(...args);
      swapTransaction.updateTransaction(...args);
    },
    // eslint-disable-next-line
    [_updateTransaction, swapTransaction.updateTransaction],
  );

  const setTransaction = useCallback(
    (...args) => {
      _setTransaction(...args);
      swapTransaction.setTransaction(...args);
    },
    // eslint-disable-next-line
    [_setTransaction, swapTransaction.setTransaction],
  );

  const mapStrategies = useCallback(
    strategy =>
      strategy.label === "slow" && disableSlowStrategy ? { ...strategy, disabled: true } : strategy,
    [disableSlowStrategy],
  );

  const titleSection = (
    <>
      <Box horizontal justifyContent="center">
        <Text fontSize={6} fontWeight="600" textTransform="capitalize">
          <Trans i18nKey="swap2.form.details.label.fees" />
        </Text>
      </Box>
      <Separator />
    </>
  );

  return (
    <Box height="100%">
      {titleSection}
      <Box mt={6} flow={4}>
        {transaction.networkInfo && (
          <SendAmountFields
            account={account}
            parentAccount={parentAccount}
            status={status}
            transaction={transaction}
            onChange={setTransaction}
            updateTransaction={updateTransaction}
            mapStrategies={mapStrategies}
          />
        )}
      </Box>
    </Box>
  );
}
