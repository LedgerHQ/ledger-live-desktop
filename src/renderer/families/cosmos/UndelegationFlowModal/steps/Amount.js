// @flow
import invariant from "invariant";
import React, { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import type { StepProps } from "../types";
import { formatDelegations } from "../../Delegation";
import type { FormattedDelegation } from "../../Delegation";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  validatorAddress,
}: StepProps) {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  invariant(account && transaction && transaction.validators, "account and transaction required");

  const { validators } = useCosmosPreloadData();
  const rawDelegations = account.cosmosResources && account.cosmosResources.delegations;
  invariant(rawDelegations, "delegations is required");

  const unit = useMemo(() => getAccountUnit(account), [account]);
  const delegations = useMemo(
    () =>
      formatDelegations(rawDelegations, validators).map(d => ({
        ...d,
        amount: formatCurrencyUnit(unit, d.amount, {
          disableRounding: true,
          alwaysShowSign: false,
          showCode: true,
        }),
      })),
    [rawDelegations, unit, validators],
  );

  const options = useMemo(
    () =>
      delegations.filter(
        // [TODO] better query test
        ({ validator }) => !query || !validator || new RegExp(query, "gi").test(validator.name),
      ),
    [query, delegations],
  );

  const value = useMemo(
    () => delegations.find(({ address }) => address === transaction.validators[0].address),
    [delegations, transaction, validatorAddress],
  );

  const bridge = getAccountBridge(account);

  const updateTxByValidatorAddress = useCallback(
    (address: string) => {
      onUpdateTransaction(tx =>
        bridge.updateTransaction(tx, {
          ...tx,
          validators: tx.validators
            ? tx.validators.sort(v => (v.address === address ? -1 : 1))
            : tx.validators,
        }),
      );
    },
    [onUpdateTransaction, bridge],
  );

  const onChangeValidator = useCallback(
    ({ validator }) => {
      updateTxByValidatorAddress(validator.validatorAddress);
    },
    [updateTxByValidatorAddress],
  );

  const count = useRef(0);
  useEffect(() => {
    if (count.current !== 0) {
      return;
    }
    updateTxByValidatorAddress(validatorAddress);
    count.current = count.current + 1;
  }, [updateTxByValidatorAddress, validatorAddress]);

  return (
    <Box flow={1}>
      <TrackPage category="Undelegation Flow" name="Step 1" />
      <Box>
        <Label>{t("cosmos.undelegation.flow.steps.amount.fields.validator")}</Label>
        <Select
          value={value}
          options={options}
          inputValue={query}
          onInputChange={setQuery}
          renderOption={OptionRow}
          renderValue={OptionRow}
          onChange={onChangeValidator}
        />
      </Box>

      <Box>
        <Label>{t("cosmos.undelegation.flow.steps.amount.fields.amount")}</Label>
      </Box>
    </Box>
  );
}

type OptionRowProps = {
  data: FormattedDelegation,
};

function OptionRow({ data: { validator, address, amount } }: OptionRowProps, i) {
  return (
    <Box key={address} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={validator ? validator.name : address} mr={2} />
        <Text ff="Inter|Medium">{validator ? validator.name : address}</Text>
      </Box>
      <Text ff="Inter|Regular">{amount}</Text>
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  onClose,
  status: { errors = {} },
  bridgePending,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  invariant(account, "account required");

  const hasErrors = !!Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
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
