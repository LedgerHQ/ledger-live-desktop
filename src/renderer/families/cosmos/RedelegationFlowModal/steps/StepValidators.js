// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button, { Base } from "~/renderer/components/Button";
import RedelegationSelectorField from "../fields/RedelegationSelectorField";
import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";
import InfoBox from "~/renderer/components/InfoBox";
import { AmountField } from "~/renderer/families/cosmos/UndelegationFlowModal/fields/index";
import ErrorBanner from "~/renderer/components/ErrorBanner";

import Label from "~/renderer/components/Label";
import ChevronRight from "~/renderer/icons/ChevronRight";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

const SelectButton = styled(Base)`
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  height: 48px;
  width: 100%;
  padding-right: ${p => p.theme.space[3]}px;
  padding-left: ${p => p.theme.space[3]}px;
  &:hover {
    background-color: transparent;
    border-color: ${p => p.theme.colors.palette.text.shade30};
  }
`;

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
  error,
  bridgePending,
  t,
  transitionTo,
}: StepProps) {
  invariant(account && account.cosmosResources && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const sourceValidator = useMemo(
    () =>
      account.cosmosResources?.delegations.find(
        d => d.validatorAddress === transaction.cosmosSourceValidator,
      ),
    [account, transaction.cosmosSourceValidator],
  );

  const updateRedelegation = useCallback(
    newTransaction => {
      onUpdateTransaction(transaction => bridge.updateTransaction(transaction, newTransaction));
    },
    [bridge, onUpdateTransaction],
  );

  const updateSourceValidator = useCallback(
    ({ validatorAddress: cosmosSourceValidator, ...r }) => {
      const source = account.cosmosResources?.delegations.find(
        d => d.validatorAddress === cosmosSourceValidator,
      );
      updateRedelegation({
        ...transaction,
        cosmosSourceValidator,
        validators:
          transaction.validators && transaction.validators.length > 0
            ? [
                {
                  ...transaction.validators[0],
                  amount: source?.amount ?? BigNumber(0),
                },
              ]
            : [],
      });
    },
    [updateRedelegation, transaction, account.cosmosResources],
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

  const selectedValidator = useMemo(() => transaction.validators && transaction.validators[0], [
    transaction,
  ]);

  const amount = useMemo(() => (selectedValidator ? selectedValidator.amount : BigNumber(0)), [
    selectedValidator,
  ]);

  const { validators } = useCosmosPreloadData();

  const selectedValidatorData = useMemo(
    () =>
      transaction.validators && transaction.validators[0]
        ? validators.find(
            ({ validatorAddress }) => validatorAddress === transaction.validators[0].address,
          )
        : null,
    [transaction, validators],
  );

  const open = useCallback(() => {
    transitionTo("destinationValidators");
  }, [transitionTo]);

  return (
    <Container>
      <TrackPage category="Redelegation Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <RedelegationSelectorField
        transaction={transaction}
        account={account}
        t={t}
        onChange={updateSourceValidator}
      />
      <StepRecipientSeparator />

      <Box py={4}>
        <Label mb={5}>{t("cosmos.redelegation.flow.steps.validators.newDelegation")}</Label>
        <SelectButton onClick={open}>
          <Box flex="1" horizontal alignItems="center" justifyContent="space-between">
            {selectedValidatorData ? (
              <Box horizontal alignItems="center">
                <FirstLetterIcon
                  label={selectedValidatorData.name || selectedValidatorData.validatorAddress}
                  mr={2}
                />
                <Text ff="Inter|Medium">
                  {selectedValidatorData.name || selectedValidatorData.validatorAddress}
                </Text>
              </Box>
            ) : (
              <Text ff="Inter|Medium">
                {t("cosmos.redelegation.flow.steps.validators.chooseValidator")}
              </Text>
            )}
            <Box color="palette.text.shade20">
              <ChevronRight size={16} color="palette.divider" />
            </Box>
          </Box>
        </SelectButton>
      </Box>
      {selectedValidatorData && (
        <Box pb={4}>
          <AmountField
            amount={amount}
            validator={sourceValidator}
            account={account}
            status={status}
            onChange={onChangeAmount}
            label={t("cosmos.redelegation.flow.steps.validators.amountLabel")}
          />
        </Box>
      )}

      <InfoBox>
        <Trans i18nKey="cosmos.redelegation.flow.steps.validators.warning">
          <b></b>
        </Trans>
      </InfoBox>
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

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
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
