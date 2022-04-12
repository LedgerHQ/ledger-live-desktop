import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { BigNumber } from "bignumber.js";
import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

import { ValidatorField, AmountField } from "../fields";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";

import estimateMaxSpendable from "@ledgerhq/live-common/lib/families/elrond/js-estimateMaxSpendable";

export default function StepDelegation({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  error,
  validators,
  delegations,
  t,
}: StepProps) {
  const [initialAmount, setInitialAmount] = useState(BigNumber(0));
  const [value, setValue] = useState(BigNumber(0));
  const bridge = getAccountBridge(account, parentAccount);

  const updateDelegation = useCallback(
    payload => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          ...payload,
          mode: "delegate",
        }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  const onChangeValidator = useCallback(
    ({ providers: [recipient] }) => {
      updateDelegation({ recipient });
    },
    [updateDelegation],
  );

  const onChangeAmount = useCallback(
    (amount: BigNumber) => {
      updateDelegation({ amount, recipient: transaction.recipient || validators[0].providers[0] });
      setValue(amount);
    },
    [updateDelegation, transaction.recipient, validators],
  );

  useEffect(() => {
    const fetchEstimation = async () => {
      const balance = await estimateMaxSpendable({ account, transaction });

      setInitialAmount(BigNumber(balance));
    };

    fetchEstimation();
  }, [transaction, account]);

  return (
    <Box flow={1}>
      <TrackPage category="Delegation Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <Box horizontal={true} justifyContent="center" mb={2}>
        <Text ff="Inter|Medium" fontSize={4}>
          <Trans i18nKey="elrond.delegation.flow.steps.amount.subtitle">
            <b></b>
          </Trans>
        </Text>
      </Box>

      <ValidatorField onChange={onChangeValidator} validators={validators} />

      <StepRecipientSeparator />

      <AmountField
        amount={value}
        account={account}
        status={status}
        initialAmount={initialAmount}
        onChange={onChangeAmount}
        label={<Trans i18nKey="elrond.delegation.flow.steps.fields.amount" />}
      />

      <Alert info="primary" mt={2}>
        <Trans i18nKey="elrond.delegation.flow.steps.amount.warning">
          <b></b>
        </Trans>
      </Alert>
    </Box>
  );
}

export function StepDelegationFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <Fragment>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />

      <Box horizontal={true}>
        <Button mr={1} secondary={true} onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>

        <Button
          id="delegate-continue-button"
          disabled={!canNext}
          primary={true}
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </Fragment>
  );
}
