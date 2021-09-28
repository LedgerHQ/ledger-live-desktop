// @flow

import React, { useCallback } from "react";
import Box, { Tabbable } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import type { CurrencyType } from "~/renderer/reducers/market";
import { useDispatch, useSelector } from "react-redux";
import Track from "~/renderer/analytics/Track";
import Pills from "~/renderer/components/Pills";
import { setMarketRange } from "~/renderer/actions/market";
import Swap from "~/renderer/icons/Swap";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import Text from "~/renderer/components/Text";

type Props = {
  currency: CurrencyType,
};

const ranges = [
  {
    value: "hour",
    label: "1H",
    key: "hour"
  },
  {
    value: "day",
    label: "1D",
    key: "day"
  },
  {
    value: "week",
    label: "1W",
    key: "week"
  },
  {
    value: "month",
    label: "1M",
    key: "month"
  },
  {
    value: "year",
    label: "1Y",
    key: "year"
  }
];

function CryptocurrencySummaryHeader({ currency }: Props) {
  const { counterValue, range } = useSelector(
    state => state.market
  );

  const dispatch = useDispatch();
  const onRangeSelected = useCallback(
    item => {
      dispatch(setMarketRange(item.value));
    },
    [dispatch]
  );

  const swap = () => {

  };

  return (
    <Box>
      <Box pb={5} horizontal alignItems="center">
        <SwapButton onClick={() => swap()}>
          <Swap />
        </SwapButton>
        <Box mt={4}>
          <Text ff="Inter|Medium" fontSize={16} color="palette.text.shade70">
            1 {currency.name.toUpperCase()}
          </Text>
          <Text ff="Inter|Medium" fontSize={28} color="palette.text.shade100">
            <FormattedVal
              animateTicker
              isNegative
              color="palette.text.shade100"
              val={`${currency.price}`}
              alwaysShowSign
              showCode
              inline
              unit={counterValue.currency.units[0]}
            />
          </Text>
        </Box>
      </Box>
      <Box horizontal justifyContent="space-between">
        <Box horizontal>
          <FormattedVal
            isPercent
            animateTicker
            isNegative
            val={Math.round(currency.change)}
            inline
            withIcon
          />
          <FormattedVal
            prefix=" ("
            suffix=")"
            animateTicker
            isNegative
            val={`${currency.difference}`}
            alwaysShowSign
            showCode
            inline
            unit={counterValue.currency.units[0]}
          />
        </Box>
        <Box>
          <Track
            onUpdate
            event="PillsDaysChange"
            selected={ranges.find(item => item.key === range)}
          />
          <Pills items={ranges} activeKey={range} onChange={onRangeSelected} bordered />
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencySummaryHeader;

const SwapButton: ThemedComponent<{}> = styled(Tabbable).attrs(() => ( {
  color: "palette.text.shade100",
  ff: "Inter",
  fontSize: 7
} ))`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  color: ${p => p.theme.colors.palette.text.shade20};
  cursor: pointer;
  display: flex;
  height: 53px;
  justify-content: center;
  margin-right: 16px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    opacity: 0.5;
  }
`;
