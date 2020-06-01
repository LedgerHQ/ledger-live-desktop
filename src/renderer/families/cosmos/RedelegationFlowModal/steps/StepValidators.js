// @flow
import invariant from "invariant";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RedelegationSelectorField from "../fields/RedelegationSelectorField";
import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";
import ValidatorField from "../fields/ValidatorField";
import InfoBox from "~/renderer/components/InfoBox";
import { AmountField } from "~/renderer/families/cosmos/UndelegationFlowModal/fields/index";

const Container: ThemedComponent<*> = styled(Box).attrs(p => ({
  flow: 1,
  relative: true,
  mr: -p.theme.overflow.trackSize,
}))`
  min-height: 330px;
  max-height: calc(100% - ${p => p.theme.space[6]}px);
  padding-bottom: 20px;
  margin-bottom: -${p => p.theme.space[6]}px;
  overflow-y: ${p => (p.isOpen ? "hidden" : "scroll")};
  > * + * {
    margin-top: 0px;
  }
`;

export default function StepValidators({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && account.cosmosResources && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const updateRedelegation = useCallback(
    newTransaction => {
      onUpdateTransaction(transaction => bridge.updateTransaction(transaction, newTransaction));
    },
    [bridge, onUpdateTransaction],
  );

  const updateSourceValidator = useCallback(
    ({ validatorAddress: cosmosSourceValidator }) =>
      updateRedelegation({
        ...transaction,
        cosmosSourceValidator,
        validators:
          transaction.validators && transaction.validators.length > 0
            ? [
                {
                  ...transaction.validators[0],
                  amount: BigNumber(0),
                },
              ]
            : [],
      }),
    [updateRedelegation, transaction],
  );

  const updateDestinationValidator = useCallback(
    ({ address }) =>
      updateRedelegation({
        ...transaction,
        validators: [
          {
            address,
            amount:
              transaction.validators && transaction.validators[0]
                ? transaction.validators[0].amount || BigNumber(0)
                : BigNumber(0),
          },
        ],
      }),
    [updateRedelegation, transaction],
  );

  const onChangeAmount = useCallback(
    amount =>
      updateRedelegation({
        ...transaction,
        validators:
          transaction.validators && transaction.validators.length > 0
            ? [
                {
                  ...transaction.validators[0],
                  amount,
                },
              ]
            : [],
      }),
    [updateRedelegation, transaction],
  );

  const sourceValidator = useMemo(
    () =>
      account.cosmosResources?.delegations.find(
        d => d.validatorAddress === transaction.cosmosSourceValidator,
      ),
    [account, transaction],
  );

  const selectedValidator = useMemo(() => transaction.validators && transaction.validators[0], [
    transaction,
  ]);

  const amount = useMemo(() => (selectedValidator ? selectedValidator.amount : BigNumber(0)), [
    selectedValidator,
  ]);

  const [validatorOpen, setValidatorOpen] = useState(false);

  return (
    <Container isOpen={validatorOpen}>
      <TrackPage category="Redelegation Flow" name="Step 1" />
      <RedelegationSelectorField
        transaction={transaction}
        account={account}
        t={t}
        onChange={updateSourceValidator}
      />
      <StepRecipientSeparator />
      <ValidatorField
        transaction={transaction}
        account={account}
        t={t}
        onChange={updateDestinationValidator}
        onOpenChange={setValidatorOpen}
        isOpen={validatorOpen}
      />
      {!validatorOpen && (
        <>
          {selectedValidator && (
            <Box mb={4}>
              <AmountField
                amount={amount}
                validator={sourceValidator}
                account={account}
                status={status}
                onChange={onChangeAmount}
              />
            </Box>
          )}

          <InfoBox>
            <Trans i18nKey="cosmos.redelegation.flow.steps.validators.warning">
              <b></b>
            </Trans>
          </InfoBox>
        </>
      )}
    </Container>
  );
}

export function StepValidatorsFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  // @TODO add in the support popover info
  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
