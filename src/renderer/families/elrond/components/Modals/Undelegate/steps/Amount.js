// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { StepProps } from "../types";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { ValidatorField, AmountField } from "../fields";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  status,
  error,
  contract,
  amount,
  delegations,
}: StepProps) {
  const [initialAmount, setInitialAmount] = useState(BigNumber(amount));
  const [value, setValue] = useState(BigNumber(amount));
  const bridge = getAccountBridge(account);

  const updateValidator = useCallback(
    payload => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          mode: "unDelegate",
          ...payload,
        }),
      );
    },
    [onUpdateTransaction, bridge],
  );

  const onChangeValidator = useCallback(
    ({ userActiveStake, contract }) => {
      updateValidator({ recipient: contract, amount: BigNumber(userActiveStake) });
      setInitialAmount(BigNumber(userActiveStake));
      setValue(BigNumber(userActiveStake));
    },
    [updateValidator],
  );

  const onChangeAmount = useCallback(
    (amount: BigNumber) => {
      updateValidator({ amount });
      setValue(amount);
    },
    [updateValidator],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Undelegation Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <Box horizontal={true} justifyContent="center" mb={2}>
        <Text ff="Inter|Medium" fontSize={4}>
          <Trans i18nKey="elrond.undelegation.flow.steps.amount.subtitle">
            <b></b>
          </Trans>
        </Text>
      </Box>

      <ValidatorField contract={contract} onChange={onChangeValidator} delegations={delegations} />

      <StepRecipientSeparator />

      <AmountField
        amount={value}
        account={account}
        status={status}
        initialAmount={initialAmount}
        onChange={onChangeAmount}
        label={<Trans i18nKey="elrond.undelegation.flow.steps.amount.fields.amount" />}
      />

      <Alert info="primary" mt={2}>
        <Trans i18nKey="elrond.undelegation.flow.steps.amount.warning">
          <b></b>
        </Trans>
      </Alert>
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("device")}>
          {t("common.continue")}
        </Button>
      </Box>
    </>
  );
}
