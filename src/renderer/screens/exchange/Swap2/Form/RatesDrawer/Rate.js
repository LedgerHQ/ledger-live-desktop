// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { getProviderName } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { rgba } from "~/renderer/styles/helpers";
import type { SwapSelectorStateType } from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import Price from "~/renderer/components/Price";
import CounterValue from "~/renderer/components/CounterValue";
import { iconByProviderName } from "../../utils";

const ProviderContainer: ThemedComponent<{}> = styled(Box).attrs({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|SemiBold",
})`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
  cursor: pointer;
  ${p =>
    p.selected
      ? `
    border-color: ${p.theme.colors.palette.primary.main};
    box-shadow: 0px 0px 0px 4px ${rgba(p.theme.colors.palette.primary.main, 0.3)};
    `
      : `
    :hover {
      box-shadow: 0px 0px 2px 1px ${p.theme.colors.palette.divider};
    }`}
`;

export type Props = {
  value: ExchangeRate,
  onSelect: ExchangeRate => void,
  selected?: boolean,
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
};

function Rate({ value, selected, onSelect, fromCurrency, toCurrency }: Props) {
  const handleSelection = useCallback(() => onSelect(value), [value, onSelect]);

  const { toAmount: amount, provider } = value;
  const ProviderIcon = provider && iconByProviderName[provider.toLowerCase()];

  return (
    <ProviderContainer p={3} mb={3} selected={selected} onClick={handleSelection}>
      {ProviderIcon && (
        <Box mr={2}>
          <ProviderIcon size={28} />
        </Box>
      )}
      <Box flex={1}>
        <Box
          horizontal
          justifyContent="space-between"
          color="palette.text.shade100"
          fontWeight="600"
        >
          <Box horizontal alignItems="center">
            <Text capitalize fontSize={4}>
              {getProviderName(value.provider)}
            </Text>
          </Box>
          <FormattedVal
            inline
            fontSize={6}
            val={amount}
            currency={toCurrency}
            unit={toCurrency?.units[0]}
            showCode={true}
            color="palette.text.shade100"
          />
        </Box>
        <Box
          horizontal
          justifyContent="space-between"
          fontSize={3}
          fontWeight={500}
          color="palette.text.shade40"
        >
          <Box horizontal alignItems="center">
            <Box mr={1}>
              {value.tradeMethod === "fixed" ? <IconLock size={16} /> : <IconLockOpen size={16} />}
            </Box>
            <Price
              withEquality
              withIcon={false}
              from={fromCurrency}
              to={toCurrency}
              rate={value.magnitudeAwareRate}
              fontSize={3}
            />
          </Box>
          <CounterValue
            inline
            currency={toCurrency}
            value={amount}
            disableRounding
            showCode
            color="palette.text.shade40"
          />
        </Box>
      </Box>
    </ProviderContainer>
  );
}

export default React.memo<Props>(Rate);
