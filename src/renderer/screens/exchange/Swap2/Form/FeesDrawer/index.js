// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import SendAmountFields from "~/renderer/modals/Send/SendAmountFields";
import { transactionSelector } from "~/renderer/actions/swap";

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  margin-top: 24px;
  margin-bottom: 24px;
`;

export default function FeesDrawer({ swapTransaction, disableSlowStrategy = false }: *) {
  const { setTransaction, updateTransaction, account, parentAccount, status } = swapTransaction;
  const transaction = useSelector(transactionSelector);

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
