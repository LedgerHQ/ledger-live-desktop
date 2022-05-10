// @flow
import React, { useState, useMemo } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";

import { listTokensForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";

import Box from "~/renderer/components/Box";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Select from "~/renderer/components/Select";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";

const EllipsisMiddle = ({ children }: { children: string }) => {
  const Start = styled(Box)`
    width: 50%;
    overflow: hidden;
  `;

  const End = styled(Box)`
    width: 50%;
    overflow: hidden;
    direction: rtl;
    display: block;
    text-overflow: ellipsis;
  `;

  const size = children.length;
  const startString = children.substring(0, Math.floor(size / 2));
  const endString = children.substring(startString.length, size);

  return (
    <>
      <Start>{startString}</Start>
      <End>{endString}</End>
    </>
  );
};

const renderItem = ({
  data: { id, name },
  isDisabled,
  data,
}: {
  data: TokenCurrency,
  isDisabled: boolean,
}) => {
  const tokenId = id.split("/")[2];
  const assetIssuer = tokenId.split(":")[1];
  return (
    <Box
      key={id}
      horizontal
      alignItems="center"
      color={isDisabled ? "palette.text.shade40" : "palette.text.shade100"}
      justifyContent="space-between"
    >
      <Box horizontal alignItems="center" justifyContent="flex-start" width="100%">
        <Box horizontal alignItems="center">
          <FirstLetterIcon
            color={isDisabled ? "palette.text.shade40" : "palette.text.shade100"}
            label={name}
            mr={1}
          />
          <Text ff="Inter|Medium">{name}</Text>
          <Text fontSize={3} color="palette.text.shade40" mr="4px">
            - ID
          </Text>
        </Box>
        <Box
          horizontal
          alignItems="center"
          flex="1"
          fontSize={3}
          color="palette.text.shade40"
          mr={2}
        >
          <EllipsisMiddle>{assetIssuer}</EllipsisMiddle>
        </Box>
      </Box>
      {isDisabled && (
        <ToolTip content={<Trans i18nKey="stellar.addAsset.steps.assets.disabledTooltip" />}>
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
        placeholder={t("stellar.addAsset.steps.assets.selectLabel")}
        noOptionsMessage={({ inputValue }) => t("common.selectNoResults", { query: inputValue })}
        onChange={onChange}
      />
    </Box>
  );
}
