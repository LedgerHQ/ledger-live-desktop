// @flow
import React, { useMemo, useCallback, useState } from "react";
import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import { denominate } from "../../helpers";
import { BigNumber } from "bignumber.js";

const renderItem = item => {
  const [provider] = item.data.providers;
  const name = item.data.name || provider;
  const balance = denominate({
    input: item.data.delegation.claimableRewards,
    showLastNonZeroDecimal: true,
  });

  return (
    <Box horizontal={true} alignItems="center" justifyContent="space-between">
      <Box horizontal={true} alignItems="center">
        <FirstLetterIcon label={name} mr={2} />
        <Text ff="Inter|Medium">{name}</Text>
      </Box>
      <Text ff="Inter|Regular">{balance} EGLD</Text>
    </Box>
  );
};

export default function DelegationSelectorField({
  validators,
  delegations,
  contract,
  t,
  onChange,
}: *) {
  const options = useMemo(
    () =>
      validators.reduce((total, validator) => {
        const item = {
          ...validator,
          delegation: delegations.find(delegation =>
            validator.providers.includes(delegation.contract),
          ),
        };

        return contract && validator.providers.includes(contract)
          ? [item, ...total]
          : [...total, item];
      }, []),
    [delegations, validators, contract],
  );

  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<any>(options[0]);

  const noOptionsMessageCallback = useCallback(
    needle =>
      t("common.selectValidatorNoOption", {
        accountName: needle.inputValue,
      }),
    [t],
  );

  const filterOptions = useCallback(
    (option, needle) =>
      BigNumber(option.data.delegation.claimableRewards).gt(0) &&
      option.data.name.toLowerCase().includes(needle.toLowerCase()),
    [],
  );

  const onValueChange = useCallback(
    option => {
      setValue(option);
      if (onChange) {
        onChange(option);
      }
    },
    [onChange],
  );

  return (
    <Box flow={1} mt={5}>
      <Label>{t("cosmos.claimRewards.flow.steps.claimRewards.selectLabel")}</Label>
      <Select
        value={value}
        options={options}
        renderValue={renderItem}
        renderOption={renderItem}
        onInputChange={setQuery}
        inputValue={query}
        filterOption={filterOptions}
        placeholder={t("common.selectAccount")}
        noOptionsMessage={noOptionsMessageCallback}
        onChange={onValueChange}
      />
    </Box>
  );
}
