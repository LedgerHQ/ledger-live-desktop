// @flow
import React, { useMemo, useCallback, useState, useEffect } from "react";
import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";
import { BigNumber } from "bignumber.js";

const renderItem = item => {
  const balance = denominate({
    input: item.data.amount,
    showLastNonZeroDecimal: true,
  });

  return (
    <Box horizontal={true} alignItems="center" justifyContent="space-between">
      <Box horizontal={true} alignItems="center">
        <FirstLetterIcon label={item.data.validator.name} mr={2} />
        <Text ff="Inter|Medium">{item.data.validator.name}</Text>
      </Box>

      <Text ff="Inter|Regular">
        {balance} {constants.egldLabel}
      </Text>
    </Box>
  );
};

export default function DelegationSelectorField({
  unbondings,
  amount,
  contract,
  t,
  onChange,
  bridge,
  transaction,
  onUpdateTransaction,
}: *) {
  const options = useMemo(
    () =>
      unbondings.reduce(
        (total, unbonding) =>
          unbonding.amount === amount && unbonding.contract === contract
            ? [unbonding, ...total]
            : [...total, unbonding],
        [],
      ),
    [unbondings, amount, contract],
  );

  const [query, setQuery] = useState("");
  const [value, setValue] = useState(options[0]);

  const noOptionsMessageCallback = useCallback(
    needle =>
      t("common.selectValidatorNoOption", {
        accountName: needle.inputValue,
      }),
    [t],
  );

  const filterOptions = useCallback(
    (option, needle) => option.data.validator.name.toLowerCase().includes(needle.toLowerCase()),
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

  useEffect(() => {
    const [defaultOption] = options;

    if (defaultOption && !Boolean(transaction.recipient) && transaction.amount.isEqualTo(0)) {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          recipient: defaultOption.contract,
          amount: BigNumber(defaultOption.amount),
        }),
      );
    }
  }, [options, bridge, transaction, onUpdateTransaction]);

  return (
    <Box flow={1} mt={5}>
      <Label>{t("elrond.withdraw.flow.steps.withdraw.selectLabel")}</Label>
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
