// @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import type { CurrencyType } from "~/renderer/reducers/market";
import Track from "~/renderer/analytics/Track";
import Pills from "~/renderer/components/Pills";
import { setMarketRange } from "~/renderer/actions/market";
import Text from "~/renderer/components/Text";
import { rangesArr } from "~/renderer/screens/market/MarketRangeSelect";

type Props = {
  currency: CurrencyType,
};

function CryptocurrencySummaryHeader({ currency }: Props) {
  const { counterCurrency, range } = useSelector(state => state.market);

  const dispatch = useDispatch();
  const onRangeSelected = useCallback(
    item => {
      dispatch(setMarketRange(item.value));
    },
    [dispatch],
  );

  rangesArr.forEach(range => {
    range.label = range.pill;
  });

  return (
    <Box>
      <Box pb={5} horizontal alignItems="center">
        <Box mt={4}>
          <Text ff="Inter|Medium" fontSize={16} color="palette.text.shade70">
            1 {currency.name.toUpperCase()}
          </Text>
          <Text ff="Inter|Medium" fontSize={28}>
            {`${currency.current_price} ${counterCurrency}`}
          </Text>
        </Box>
      </Box>
      <Box horizontal justifyContent="space-between">
        <Box horizontal>
          <FormattedVal
            isPercent
            animateTicker
            isNegative
            val={currency.price_change_percentage_in_currency}
            inline
            withIcon
          />
          <Text ff="Inter|Medium" fontSize={16} pl={2}>
            {`(${currency.difference.toFixed(currency.magnitude)} ${counterCurrency})`}
          </Text>
        </Box>
        <Box>
          <Track
            onUpdate
            event="PillsDaysChange"
            selected={rangesArr.find(item => item.key === range)}
          />
          <Pills items={rangesArr} activeKey={range} onChange={onRangeSelected} bordered />
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencySummaryHeader;
