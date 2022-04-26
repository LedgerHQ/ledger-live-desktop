// @flow
import React, { useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

const Item = item => {
  const [provider] = item.data.providers;

  return (
    <Box key={provider} horizontal={true} alignItems="center" justifyContent="space-between">
      <Box horizontal={true} alignItems="center">
        <FirstLetterIcon label={item.data.name} mr={2} />
        <Text ff="Inter|Medium">{item.data.name}</Text>
      </Box>

      <Box pr={1}>
        <Text textAlign="center" fontSize={1}>
          <Trans i18nKey="elrond.delegation.apr" /> {item.data.apr ? `${item.data.apr} %` : "N/A"}
        </Text>
      </Box>
    </Box>
  );
};

const Dropdown = ({ validators, onChange }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(validators[0]);

  const noOptionsMessageCallback = useCallback(
    needle =>
      t("common.selectValidatorNoOption", {
        accountName: needle.inputValue,
      }),
    [t],
  );

  const filterOptions = useCallback(
    (option, needle) => option.data.name.toLowerCase().includes(needle.toLowerCase()),
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
    <Box mb={4}>
      <Label>{t("elrond.delegation.flow.steps.amount.fields.validator")}</Label>
      <Select
        value={value}
        options={validators}
        renderValue={Item}
        renderOption={Item}
        onInputChange={setQuery}
        inputValue={query}
        filterOption={filterOptions}
        placeholder={t("common.selectAccount")}
        noOptionsMessage={noOptionsMessageCallback}
        onChange={onValueChange}
      />
    </Box>
  );
};

export default Dropdown;
