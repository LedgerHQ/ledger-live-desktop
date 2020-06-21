// @flow
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { StepProps } from "../types";
import type { CosmosMappedDelegation } from "@ledgerhq/live-common/lib/families/cosmos/types";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { ValidatorField, AmountField } from "../fields";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  status,
  error,
  validatorAddress,
}: StepProps) {
  invariant(account && transaction && transaction.validators, "account and transaction required");

  const bridge = getAccountBridge(account);

  const updateValidator = useCallback(
    validatorFields => {
      onUpdateTransaction(tx =>
        bridge.updateTransaction(tx, {
          ...tx,
          validators:
            tx.validators && tx.validators.length > 0
              ? [{ ...tx.validators[0], ...validatorFields }]
              : [validatorFields],
        }),
      );
    },
    [onUpdateTransaction, bridge],
  );

  const onChangeValidator = useCallback(
    ({ validatorAddress, amount }: CosmosMappedDelegation) => {
      updateValidator({ address: validatorAddress, amount });
    },
    [updateValidator],
  );

  const onChangeAmount = useCallback(
    (amount: BigNumber) => {
      updateValidator({ amount });
    },
    [updateValidator],
  );

  const validator = useMemo(() => transaction.validators && transaction.validators[0], [
    transaction,
  ]);

  const amount = useMemo(() => (validator ? validator.amount : BigNumber(0)), [validator]);

  return (
    <Box flow={1}>
      <TrackPage category="Undelegation Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <Box horizontal justifyContent="center" mb={2}>
        <Text ff="Inter|Medium" fontSize={4}>
          <Trans i18nKey="cosmos.undelegation.flow.steps.amount.subtitle">
            <b></b>
          </Trans>
        </Text>
      </Box>
      <ValidatorField account={account} transaction={transaction} onChange={onChangeValidator} />
      <AmountField
        amount={amount}
        validator={validator}
        account={account}
        status={status}
        onChange={onChangeAmount}
        label={<Trans i18nKey="cosmos.undelegation.flow.steps.amount.fields.amount" />}
      />
      <Box mt={2}>
        <InfoBox>
          <Trans i18nKey="cosmos.undelegation.flow.steps.amount.warning">
            <b></b>
          </Trans>
        </InfoBox>
      </Box>
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

  invariant(account, "account required");

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
