// @flow
import React, { PureComponent } from "react";
import styled, { withTheme } from "styled-components";
import { Trans } from "react-i18next";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import Tooltip from "~/renderer/components/Tooltip";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import CryptoCurrencyIcon, { TokenIconWrapper, TokenIcon } from "./CryptoCurrencyIcon";

type Props = {
  currency: Currency,
  count: number,
  withTooltip?: boolean,
  bigger?: boolean,
  inactive?: boolean,
  theme: any,
};

const Wrapper: ThemedComponent<{
  doubleIcon?: boolean,
  bigger?: boolean,
}> = styled.div`
  ${p =>
    p.doubleIcon
      ? `
  margin-right: -12px;`
      : `
  display: flex;
  align-items: center;`}

  line-height: ${p => (p.bigger ? "18px" : "18px")};
  font-size: ${p => (p.bigger ? "12px" : "12px")};

  > :nth-child(2) {
    margin-top: ${p => (p.bigger ? "-14px" : "-12px")};
    margin-left: ${p => (p.bigger ? "10px" : "8px")};

    border: 2px solid transparent;
  }
`;

class CryptoCurrencyIconWithCount extends PureComponent<Props> {
  render() {
    const { currency, bigger, withTooltip, inactive, count, theme } = this.props;
    const color = inactive
      ? theme.colors.palette.text.shade60
      : getCurrencyColor(currency, theme.colors.palette.background.paper);

    const size = bigger ? 20 : 16;
    const fontSize = size / 2 + (count < 10 ? 2 : count >= 100 ? -2 : 0);

    const content = (
      <Wrapper doubleIcon={count > 0} bigger={bigger}>
        <CryptoCurrencyIcon inactive={inactive} currency={currency} size={size} />
        {count > 0 && (
          <TokenIconWrapper>
            <TokenIcon color={color} size={size} fontSize={fontSize}>
              {`+${count}`}
            </TokenIcon>
          </TokenIconWrapper>
        )}
      </Wrapper>
    );

    const isToken =
      currency.type === "CryptoCurrency" && listTokenTypesForCryptoCurrency(currency).length > 0;
    if (withTooltip && count > 0) {
      return (
        <Tooltip
          content={
            <Trans
              i18nKey={isToken ? "tokensList.countTooltip" : "subAccounts.countTooltip"}
              count={count}
              values={{ count }}
            />
          }
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  }
}

export default withTheme(CryptoCurrencyIconWithCount);
