// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useCosmosDelegationsQuerySelector } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type {
  CosmosMappedDelegation,
  Transaction,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

const renderItem = ({
  data: { validatorAddress, validator, formattedAmount, status },
}: {
  data: CosmosMappedDelegation,
}) => {
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
};

type RedelegationSelectorFieldProps = {
  account: Account,
  transaction: Transaction,
  onChange: (delegation: CosmosMappedDelegation) => void,
};

export default function RedelegationSelectorField({
  account,
  transaction,
  onChange,
}: RedelegationSelectorFieldProps) {
  const { t } = useTranslation();
  const { query, setQuery, options, value } = useCosmosDelegationsQuerySelector(
    account,
    transaction,
  );

  return (
    <Box flow={1} pb={5}>
      <Label>{t("cosmos.redelegation.flow.steps.validators.currentDelegation")}</Label>
      <Select
        value={value}
        options={options}
        getOptionValue={({ address }) => address}
        renderValue={renderItem}
        renderOption={renderItem}
        onInputChange={setQuery}
        inputValue={query}
        filterOption={false}
        isDisabled={options.length <= 1}
        placeholder={t("common.selectAccount")}
        noOptionsMessage={({ inputValue }) =>
          t("common.selectAccountNoOption", { accountName: inputValue })
        }
        onChange={onChange}
      />
    </Box>
  );
}
