// @flow
import React from "react";
import { useCosmosDelegationsQuerySelector } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type {
  CosmosValidatorItem,
  CosmosDelegationStatus,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";

const renderItem = ({
  data: { validator, address, formattedAmount, status },
}: {
  data: {
    validator: ?CosmosValidatorItem,
    address: string,
    formattedAmount: string,
    status: CosmosDelegationStatus,
  },
}) => {
  return (
    <Box key={address} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={validator ? validator.name : address} mr={2} />
        <Text ff="Inter|Medium">{validator ? validator.name : address}</Text>
      </Box>
      <Text ff="Inter|Regular">{formattedAmount}</Text>
    </Box>
  );
};

export default function RedelegationSelectorField({ account, transaction, t, onChange }: *) {
  const { query, setQuery, options, value } = useCosmosDelegationsQuerySelector(
    account,
    transaction,
    "redelegate",
  );

  return (
    <Box flow={1} mb={5}>
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
        placeholder={t("common.selectAccount")}
        noOptionsMessage={({ inputValue }) =>
          t("common.selectAccountNoOption", { accountName: inputValue })
        }
        onChange={onChange}
      />
    </Box>
  );
}
