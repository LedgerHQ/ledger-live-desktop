// @flow
import invariant from "invariant";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import { formatDelegations } from "../../Delegation";
import type { FormattedDelegation } from "../../Delegation";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: (delegaiton: FormattedDelegation) => void,
};

export default function ValidatorField({ account, transaction, onChange }: Props) {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  const unit = useMemo(() => getAccountUnit(account), [account]);
  const { validators } = useCosmosPreloadData();

  const rawDelegations = account.cosmosResources && account.cosmosResources.delegations;
  invariant(rawDelegations, "delegations is required");

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
    [delegations, transaction],
  );

  return (
    <Box>
      <Label>{t("cosmos.undelegation.flow.steps.amount.fields.validator")}</Label>
      <Select
        value={value}
        options={options}
        inputValue={query}
        onInputChange={setQuery}
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

function OptionRow({ data: { address, validator, amount } }: OptionRowProps, i) {
  return (
    <Box key={address} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={validator?.name ?? address} mr={2} />
        <Text ff="Inter|Medium">{validator?.name ?? address}</Text>
      </Box>
      <Text ff="Inter|Regular">{amount}</Text>
    </Box>
  );
}
