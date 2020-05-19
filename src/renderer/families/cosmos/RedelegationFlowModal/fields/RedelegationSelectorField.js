// @flow
import React, { useState } from "react";

import type {
  CosmosValidatorItem,
  CosmosDelegationStatus,
} from "@ledgerhq/live-common/lib/families/cosmos/types";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";

import Box from "~/renderer/components/Box";

import Select from "~/renderer/components/Select";
import { formatDelegations } from "../../Delegation/index";
import Text from "~/renderer/components/Text";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Label from "~/renderer/components/Label";

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
  const unit = getAccountUnit(account);

  const [search, setSearch] = useState();

  const { validators } = useCosmosPreloadData();

  const delegations = account.cosmosResources && account.cosmosResources.delegations;

  const formattedDelegations = formatDelegations(delegations, validators).map(
    ({ amount, ...rest }) => ({
      ...rest,
      amount,
      formattedAmount: formatCurrencyUnit(unit, amount, {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true,
      }),
    }),
  );

  const filteredDelegations = formattedDelegations.filter(({ validator }) => {
    return !search || !validator || new RegExp(search, "gi").test(validator.name);
  });

  const selectedValidator = filteredDelegations.find(
    ({ address }) => address === transaction.cosmosSourceValidator,
  );

  return (
    <Box flow={1} mb={5}>
      <Label>{t("cosmos.redelegation.flow.steps.validators.currentDelegation")}</Label>
      <Select
        value={selectedValidator}
        options={filteredDelegations}
        getOptionValue={({ address }) => address}
        renderValue={renderItem}
        renderOption={renderItem}
        onInputChange={setSearch}
        inputValue={search}
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
