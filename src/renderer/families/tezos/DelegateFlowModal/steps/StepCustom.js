// @flow
import invariant from "invariant";
import React, { useCallback, useEffect, useRef } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import RecipientField from "~/renderer/modals/Send/fields/RecipientField";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import UserPlusIcon from "~/renderer/icons/UserPlus";
import type { StepProps } from "../types";

const IconWrapper = styled(Box).attrs(() => ({
  py: 4,
  px: 17,
}))`
  border-radius: 18px;
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.palette.action.hover};
`;

const StepCustom = ({
  account,
  parentAccount,
  transaction,
  status,
  onChangeTransaction,
  t,
  eventType,
}: StepProps) => {
  invariant(account && transaction, "account & transaction is required");
  const mainAccount = getMainAccount(account, parentAccount);
  return (
    <Box flow={4} mx={40}>
      <TrackPage
        category={`Delegation Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step Custom"
      />
      <Box>
        <IconWrapper color="palette.primary.main">
          <UserPlusIcon size={30} />
        </IconWrapper>
        <Box mt={24} px={2}>
          <Text ff="Inter|Regular" color="palette.text.shade80" fontSize={4} textAlign="center">
            <Trans i18nKey="delegation.flow.steps.custom.text" />
          </Text>
        </Box>
      </Box>
      <Box my={24}>
        <RecipientField
          label="Validator address"
          account={mainAccount}
          transaction={transaction}
          status={status}
          onChangeTransaction={onChangeTransaction}
          autoFocus
          t={t}
        />
      </Box>
    </Box>
  );
};
export const StepCustomFooter = ({
  t,
  transaction,
  onChangeTransaction,
  account,
  parentAccount,
  status,
  bridgePending,
  transitionTo,
}: StepProps) => {
  invariant(account && transaction, "account and transaction");
  const { errors } = status;
  const canNext = !bridgePending && !Object.keys(errors).length;

  const initialTransaction = useRef(transaction);
  useEffect(() => {
    // empty the field
    onChangeTransaction(
      getAccountBridge(account, parentAccount).updateTransaction(initialTransaction.current, {
        recipient: "",
      }),
    );
  }, [onChangeTransaction, account, parentAccount]);

  const onBack = useCallback(() => {
    // we need to revert
    onChangeTransaction(
      getAccountBridge(account, parentAccount).updateTransaction(transaction, {
        recipient: initialTransaction.current.recipient,
      }),
    );
    transitionTo("summary");
  }, [account, parentAccount, onChangeTransaction, transaction, transitionTo]);

  const onNext = useCallback(() => {
    transitionTo("summary");
  }, [transitionTo]);

  return (
    <>
      <Button secondary onClick={onBack} mr={1}>
        {t("common.back")}
      </Button>
      <Button primary disabled={!canNext} onClick={onNext}>
        {t("delegation.flow.steps.custom.button")}
      </Button>
    </>
  );
};

export default StepCustom;
