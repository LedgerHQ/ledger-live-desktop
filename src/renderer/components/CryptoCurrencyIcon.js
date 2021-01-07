// @flow
import React from "react";
import styled, { withTheme } from "styled-components";
import { getCryptoCurrencyIcon, getTokenCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { mix } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  currency: Currency,
  circle?: boolean,
  size: number,
  overrideColor?: string,
  inactive?: boolean,
  theme: any,
};

// NB this is to avoid seeing the parent icon through
export const TokenIconWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 4px;
`;
export const CircleWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 50%;
  border: 1px solid transparent;
  background: ${p => p.color};
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  align-items: center;
  justify-content: center;
  display: flex;
`;
export const TokenIcon: ThemedComponent<{
  fontSize?: number,
  size: number,
  color?: string,
  circle?: boolean,
}> = styled.div`
  font-size: ${p => (p.fontSize ? p.fontSize : p.size / 2)}px;
  font-family: "Inter";
  font-weight: bold;
  color: ${p => p.color};
  background-color: ${p => mix(p.color, p.theme.colors.palette.background.default, 0.9)};
  border-radius: 4px;
  border-radius: ${p => (p.circle ? "50%" : "4px")};
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`;

const CryptoCurrencyIcon = ({ currency, circle, size, overrideColor, inactive, theme }: Props) => {
  const currencyColor = getCurrencyColor(currency, theme.colors.palette.background.paper);
  const color = overrideColor || (inactive ? theme.colors.palette.text.shade60 : currencyColor);

  if (currency.type === "FiatCurrency") {
    return null;
  }
  if (currency.type === "TokenCurrency") {
    const TokenIconCurrency = getTokenCurrencyIcon && getTokenCurrencyIcon(currency);

    return (
      <TokenIconWrapper>
        <TokenIcon circle={circle} color={color} size={size}>
          {TokenIconCurrency ? (
            <TokenIconCurrency size={size * 0.55} color={color} />
          ) : (
            currency.ticker[0]
          )}
        </TokenIcon>
      </TokenIconWrapper>
    );
  }
  const IconCurrency = getCryptoCurrencyIcon(currency);
  return IconCurrency ? (
    circle ? (
      <CircleWrapper size={size} color={color}>
        <IconCurrency size={size * 0.55} color={theme.colors.palette.background.paper} />
      </CircleWrapper>
    ) : (
      <IconCurrency size={size} color={color} />
    )
  ) : null;
};

export default withTheme(CryptoCurrencyIcon);
