// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
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
}: StepProps) {
  const { t } = useTranslation();

  invariant(account && transaction && transaction.validators, "account and transaction required");

  const { validators } = useCosmosPreloadData();
  const rawDelegations = account.cosmosResources && account.cosmosResources.delegations;
  invariant(rawDelegations, "delegations is required");

  const unit = useMemo(() => getAccountUnit(account), [account]);
  const delegations = useMemo(
    () =>
      formatDelegations(rawDelegations, validators).map(val => {
        return {
          ...val,
          amount: formatCurrencyUnit(unit, val.amount, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true,
          }),
        };
      }),
    [rawDelegations, unit, validators],
  );

  // const bridge = getAccountBridge(account);

  // const updateDelegation = useCallback(
  //   updater => {
  //     onUpdateTransaction(transaction =>
  //       bridge.updateTransaction(transaction, {
  //         validators: updater(transaction.validators || []),
  //       }),
  //     );
  //   },
  //   [bridge, onUpdateTransaction],
  // );

  const onChange = useCallback(val => {
    console.log(val);
    // onUpdateTransaction(tx => {
    //   bridge.updateTransaction(tx, {
    //     validators: tx.validators
    //   })
    // })
  }, []);

  return (
    <Box flow={1}>
      <TrackPage category="Undelegation Flow" name="Step 1" />
      <Label>{t("send.steps.details.amount")}</Label>
      <Select
        options={delegations}
        renderOption={OptionRow}
        renderValue={OptionRow}
        onChange={onChange}
      />
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
