// @flow
import React, { useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import type { BalanceHistoryData } from "@ledgerhq/live-common/lib/types";
import Chart from "~/renderer/components/Chart";
import Box, { Card } from "~/renderer/components/Box";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import FormattedDate from "~/renderer/components/FormattedDate";
import CryptocurrencySummaryHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummaryHeader";
import { useMarketCurrencyChart } from "~/renderer/hooks/market/useMarketCurrency";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import useTheme from "~/renderer/hooks/useTheme";
import { useRange } from "~/renderer/hooks/market/useRange";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import BigNumber from "bignumber.js";
import moment from "moment";
import { MarketContext } from "~/renderer/contexts/MarketContext";

type Props = {
  currency: MarketCurrencyInfo,
  range: string,
  counterValue: any,
  loading: boolean,
};

export default function CryptocurrencySummary({
  currency,
  counterValue,
  loading: propsLoading,
}: Props) {
  const discreetMode = useSelector(discreetModeSelector);

  const {
    params: { id },
  } = useRouteMatch();

  const { contextState } = useContext(MarketContext);
  const { counterCurrency, range, reload } = contextState;

  const { rangeData } = useRange(range);

  const renderTickY = useCallback((val: number) => val, []);

  const bgColor = useTheme("colors.palette.background.paper");

  let chartColor = useTheme("colors.palette.text.shade100");

  if (currency.supportedCurrency) {
    chartColor = getCurrencyColor(currency.supportedCurrency, bgColor);
  }

  const chartMockColor = useTheme("colors.palette.text.shade5");

  const { loading: chartLoading, chartData } = useMarketCurrencyChart({
    id: id || "",
    counterCurrency,
    range,
    reload,
  });

  const loading: boolean = propsLoading || chartLoading;

  const renderTooltip = useCallback(
    (data: BalanceHistoryData) =>
      !loading && (
        <Tooltip
          data={data}
          counterCurrency={counterCurrency.toUpperCase()}
          range={rangeData.scale}
        />
      ),
    [counterCurrency, loading, rangeData.scale],
  );

  const chartMockData = [];

  for (let i = 1; i < 10; i++) {
    let value: BigNumber;
    if (i < 4) {
      value = BigNumber(i * 10);
    } else if (i < 7) {
      value = BigNumber(i * 7);
    } else {
      value = BigNumber(i * 4);
    }
    chartMockData.push({
      date: moment()
        .add(i, `${rangeData.scale}s`)
        .toDate(),
      value: value,
    });
  }

  currency.difference =
    chartData.length > 1
      ? parseFloat(
          (
            parseFloat(chartData[0].value) - parseFloat(chartData[chartData.length - 1].value)
          ).toFixed(currency.magnitude),
        )
      : 0;

  return (
    <Card p={0} py={5}>
      <Box px={6} data-e2e="dashboard_graph">
        <CryptocurrencySummaryHeader
          loading={loading}
          currency={currency}
          counterValue={counterValue}
        />
      </Box>
      <Box
        px={5}
        ff="Inter"
        fontSize={4}
        color="palette.text.shade80"
        pt={5}
        style={{ overflow: "visible" }}
      >
        {!loading ? (
          <Chart
            magnitude={currency.magnitude}
            color={chartColor}
            data={chartData}
            height={250}
            loading={false}
            tickXScale={rangeData.scale}
            renderTickY={discreetMode ? () => "" : renderTickY}
            renderTooltip={renderTooltip}
            key={1}
          />
        ) : (
          <Chart
            magnitude={1}
            color={chartMockColor}
            data={chartMockData}
            height={250}
            loading={true}
            tickXScale={rangeData.scale}
            renderTickY={discreetMode ? () => "" : renderTickY}
            renderTooltip={renderTooltip}
            key={2}
          />
        )}
      </Box>
    </Card>
  );
}

function Tooltip({ data, counterCurrency }: { data: BalanceHistoryData, counterCurrency: string }) {
  return (
    <>
      {`${data.value} ${counterCurrency}`}
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
        <FormattedDate date={data.date} format="LL" />
      </Box>
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
        <FormattedDate date={data.date} format="LT" />
      </Box>
    </>
  );
}
