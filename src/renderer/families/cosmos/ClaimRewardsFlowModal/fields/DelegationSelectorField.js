// @flow
import React, { useState } from "react";
import { useCosmosFormattedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
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
  data: { validator, address, reward, status },
}: {
  data: {
    validator: ?CosmosValidatorItem,
    address: string,
    reward: string,
    status: CosmosDelegationStatus,
  },
}) => {
  return (
    <Box key={address} horizontal alignItems="center" justifyContent="space-between">
      <Box horizontal alignItems="center">
        <FirstLetterIcon label={validator ? validator.name : address} mr={2} />
        <Text ff="Inter|Medium">{validator ? validator.name : address}</Text>
      </Box>
      <Text ff="Inter|Regular">{reward}</Text>
    </Box>
  );
};

export default function DelegationSelectorField({ account, transaction, t, onChange }: *) {
  const [search, setSearch] = useState();

  const formattedDelegations = useCosmosFormattedDelegations(account, "claimReward");

  const filteredDelegations = formattedDelegations.filter(({ validator }) => {
    return !search || !validator || new RegExp(search, "gi").test(validator.name);
  });

  const selectedValidator = filteredDelegations.find(
    ({ address }) => address === transaction.validators[0].address,
  );

  return (
    <Box flow={1} mt={5}>
      <Label>{t("cosmos.claimRewards.flow.steps.claimRewards.selectLabel")}</Label>
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
