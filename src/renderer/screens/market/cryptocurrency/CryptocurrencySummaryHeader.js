// @flow

import React, { useCallback, useContext } from "react";

import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Track from "~/renderer/analytics/Track";
import Pills from "~/renderer/components/Pills";
import Text from "~/renderer/components/Text";
import { rangesArr } from "~/renderer/components/MarketList/MarketRangeSelect";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import CounterValueFormatter from "~/renderer/components/CounterValueFormatter";
import { useTranslation } from "react-i18next";
import LoadingPlaceholder from "~/renderer/components/LoadingPlaceholder";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { SET_MARKET_RANGE } from "~/renderer/contexts/actionTypes";

type Props = {
  currency: MarketCurrencyInfo,
  loading: boolean,
};

function CryptocurrencySummaryHeader({ currency, loading }: Props) {
  const { contextState, contextDispatch } = useContext(MarketContext);
  // const { counterCurrency, range } = useSelector(state => state.market);
  const { counterCurrency, range } = contextState;
  const { t } = useTranslation();

  const onRangeSelected = useCallback(
    item => {
      const range = item.value || "1d";
      contextDispatch(SET_MARKET_RANGE, range);
    },
    [contextDispatch],
  );

  const difference = currency.difference || 0;

  const ranges = rangesArr.map(range => ({
    ...range,
    label: t(`market.range.${range.label}_label`),
  }));

  return (
    <Box>
      <Box pb={5} horizontal alignItems="center">
        <Box mt={4}>
          <Text ff="Inter|Medium" fontSize={16} color="palette.text.shade70">
            {loading ? (
              <LoadingPlaceholder style={{ height: "8px", width: "57px" }} />
            ) : (
              `1 ${currency.name && currency.name.toUpperCase()}`
            )}
          </Text>
          <Text ff="Inter|Medium" fontSize={28} color="palette.text.shade100">
            <CounterValueFormatter currency={counterCurrency} value={currency.current_price} />
          </Text>
        </Box>
      </Box>
      <Box horizontal justifyContent="space-between">
        <Box horizontal>
          {loading && !currency.price_change_percentage_in_currency ? (
            <LoadingPlaceholder style={{ height: "24px", width: "288px" }} />
          ) : (
            <FormattedVal
              isPercent
              animateTicker
              isNegative
              val={
                currency.price_change_percentage_in_currency &&
                parseFloat(currency.price_change_percentage_in_currency.toFixed(2))
              }
              inline
              withIcon
            />
          )}
          {loading ? (
            <LoadingPlaceholder style={{ height: "8px", width: "57px" }} />
          ) : (
            <Text ff="Inter|Medium" fontSize={16} pl={2}>
              ({<CounterValueFormatter currency={counterCurrency} value={difference} />})
            </Text>
          )}
        </Box>
        <Box>
          <Track
            onUpdate
            event="PillsDaysChange"
            selected={rangesArr.find(item => item.key === range)}
          />
          <Pills
            loading={loading}
            items={ranges}
            activeKey={range}
            onChange={onRangeSelected}
            bordered
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencySummaryHeader;
