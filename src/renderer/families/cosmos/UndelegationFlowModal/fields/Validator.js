// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useCosmosDelegationsQuerySelector } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type {
  Transaction,
  CosmosMappedDelegation,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: (delegaiton: CosmosMappedDelegation) => void,
};

export default function ValidatorField({ account, transaction, onChange }: Props) {
  const { t } = useTranslation();
  const { query, setQuery, options, value } = useCosmosDelegationsQuerySelector(
    account,
    transaction,
  );

  return (
    <Box mb={4}>
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
  data: CosmosMappedDelegation,
};

function OptionRow({ data: { validatorAddress, validator, formattedAmount } }: OptionRowProps) {
  const name = validator?.name ?? validatorAddress;
  return (
    <Box key={validatorAddress} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={name} mr={2} />
        <Text ff="Inter|Medium">{name}</Text>
      </Box>
      <Text ff="Inter|Regular">{formattedAmount}</Text>
    </Box>
  );
}
