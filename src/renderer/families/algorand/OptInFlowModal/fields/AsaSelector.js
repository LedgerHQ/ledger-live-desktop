// @flow
import React, { useState, useMemo } from "react";
import { Trans } from "react-i18next";

import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";

import { listTokensForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import { extractTokenId } from "@ledgerhq/live-common/lib/families/algorand/tokens";

import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";

const renderItem = ({
  data: { id, name },
  isDisabled,
  data,
}: {
  data: TokenCurrency,
  isDisabled: boolean,
}) => {
  const tokenId = extractTokenId(id);
  return (
    <Box
      key={id}
      horizontal
      alignItems="center"
      color={isDisabled ? "palette.text.shade40" : "palette.text.shade100"}
      justifyContent="space-between"
    >
      <Box horizontal alignItems="center" justifyContent="flex-start">
        <FirstLetterIcon
          color={isDisabled ? "palette.text.shade40" : "palette.text.shade100"}
          label={name}
          mr={2}
        />
        <Text ff="Inter|Medium">{name}</Text>
        <Text fontSize={3} color="palette.text.shade40">
          - ID {tokenId}
        </Text>
      </Box>
      {isDisabled && (
        <ToolTip content={<Trans i18nKey="algorand.optIn.flow.steps.assets.disabledTooltip" />}>
          <Box color="warning">
            <ExclamationCircleThin size={16} />
          </Box>
        </ToolTip>
      )}
    </Box>
  );
};

export default function DelegationSelectorField({ account, transaction, t, onChange }: *) {
  const [query, setQuery] = useState("");
  const subAccounts = account.subAccounts;
  const options = listTokensForCryptoCurrency(account.currency);
  const value = useMemo(() => options.find(({ id }) => id === transaction.assetId), [
    options,
    transaction,
  ]);

  return (
    <Box flow={1} mb={4}>
      <Select
        value={value}
        options={options}
        getOptionValue={({ name }) => name}
        isOptionDisabled={({ id }) => subAccounts.some(({ token }) => token.id === id)}
        renderValue={renderItem}
        renderOption={renderItem}
        onInputChange={setQuery}
        inputValue={query}
        placeholder={t("algorand.optIn.flow.steps.assets.selectLabel")}
        noOptionsMessage={({ inputValue }) => t("common.selectNoResults", { query: inputValue })}
        onChange={onChange}
      />
    </Box>
  );
}
