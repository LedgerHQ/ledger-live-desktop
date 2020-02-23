// @flow

import React from "react";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import CounterValue from "~/renderer/components/CounterValue";
import { useHistory } from "react-router-dom";
import useTheme from "~/renderer/hooks/useTheme";

import FormattedVal from "~/renderer/components/FormattedVal";
import Price from "~/renderer/components/Price";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";
import Bar from "./Bar";

export interface DistributionItem {
  currency: CryptoCurrency | TokenCurrency;
  distribution: number; // % of the total (normalized in 0-1)
  amount: BigNumber;
  countervalue: BigNumber; // countervalue of the amount that was calculated based of the rate provided
}

interface Props {
  item: DistributionItem;
  isVisible: boolean;
}

export default function Row({ item: { currency, amount, distribution }, isVisible }: Props) {
  const theme = useTheme();
  const history = useHistory();
  const color = getCurrencyColor(currency, theme.colors.palette.background.paper);
  const percentage = (Math.floor(distribution * 10000) / 100).toFixed(2);
  const icon = <CryptoCurrencyIcon currency={currency} size={16} />;

  return (
    <Wrapper onClick={() => history.push(`/asset/${currency.id}`)}>
      <Asset>
        {icon}
        <Tooltip delay={1200} content={currency.name}>
          <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
            {currency.name}
          </Ellipsis>
        </Tooltip>
      </Asset>
      <PriceSection>
        {distribution ? (
          <Price from={currency} color="palette.text.shade80" fontSize={3} />
        ) : (
          <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
            {"-"}
          </Text>
        )}
      </PriceSection>
      <Distribution>
        {!!distribution && (
          <>
            <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
              {`${percentage}%`}
            </Text>
            <Bar progress={isVisible ? percentage : "0"} progressColor={color} />
          </>
        )}
      </Distribution>
      <Amount>
        <Ellipsis>
          <FormattedVal
            color={"palette.text.shade80"}
            unit={currency.units[0]}
            val={amount}
            fontSize={3}
            showCode
          />
        </Ellipsis>
      </Amount>
      <Value>
        <Ellipsis>
          {distribution ? (
            <CounterValue
              currency={currency}
              value={amount}
              disableRounding
              color="palette.text.shade100"
              fontSize={3}
              showCode
              alwaysShowSign={false}
            />
          ) : (
            <Text ff="Inter" color="palette.text.shade100" fontSize={3}>
              {"-"}
            </Text>
          )}
        </Ellipsis>
      </Value>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  cursor: pointer;

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
  }
`;

const Asset = styled.div`
  flex: 1;
  width: 20%;
  > :first-child {
    margin-right: 10px;
  }
  > :nth-child(2) {
    margin-right: 8px;
  }
`;

const PriceSection = styled.div`
  width: 20%;
  text-align: left;
  > :first-child {
    margin-right: 6px;
  }
`;

const Distribution = styled.div`
  width: 20%;
  text-align: right;
  > :first-child {
    margin-right: 11px;
    width: 40px; //max width for a 99.99% case
    text-align: right;
  }
`;

const Amount = styled.div`
  width: 25%;
  justify-content: flex-end;
`;

const Value = styled.div`
  width: 15%;
  box-sizing: border-box;
  padding-left: 8px;
  justify-content: flex-end;
`;
