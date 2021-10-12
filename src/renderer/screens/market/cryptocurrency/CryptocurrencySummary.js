// @flow
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import type { BalanceHistoryData } from "@ledgerhq/live-common/lib/types";

import Chart from "~/renderer/components/Chart";
import Box, { Card } from "~/renderer/components/Box";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import FormattedDate from "~/renderer/components/FormattedDate";
import type { CurrencyType } from "~/renderer/reducers/market";
import CryptocurrencySummaryHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummaryHeader";
import { useMarketCurrencyChart } from "~/renderer/hooks/market/useMarketCurrency";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import useTheme from "~/renderer/hooks/useTheme";
import { useRange } from "~/renderer/hooks/market/useRange";

type Props = {
  currency: CurrencyType,
  range: string,
  counterValue: any,
};

export default function CryptocurrencySummary({ currency, counterValue }: Props) {
  const discreetMode = useSelector(discreetModeSelector);

  const {
    params: { id },
  } = useRouteMatch();

  const { counterCurrency, range } = useSelector(state => state.market);

  const { rangeData } = useRange(range);

  const renderTickY = useCallback((val: number) => val, []);

  const bgColor = useTheme("colors.palette.background.paper");
  const chartColor = getCurrencyColor(currency.supportedCurrency, bgColor);

  const { loading, chartData } = useMarketCurrencyChart({ id, counterCurrency, range });

  const renderTooltip = useCallback(
    (data: BalanceHistoryData) => (
      <Tooltip data={data} counterCurrency={counterCurrency} range={rangeData.scale} />
    ),
    [counterCurrency, rangeData.scale],
  );

  if (loading) {
    return null;
  }

  currency.difference = chartData[chartData.length - 1].value - chartData[0].value || 0;

  return (
    <Card p={0} py={5}>
      <Box px={6} data-e2e="dashboard_graph">
        <CryptocurrencySummaryHeader currency={currency} counterValue={counterValue} />
      </Box>

      <Box
        px={5}
        ff="Inter"
        fontSize={4}
        color="palette.text.shade80"
        pt={5}
        style={{ overflow: "visible" }}
      >
        <Chart
          magnitude={currency.supportedCurrency.units[0].magnitude}
          color={chartColor}
          data={chartData}
          height={250}
          tickXScale={rangeData.scale}
          renderTickY={discreetMode ? () => "" : renderTickY}
          renderTooltip={renderTooltip}
        />
      </Box>
    </Card>
  );
}

function Tooltip({ data, counterCurrency }: { data: BalanceHistoryData, counterCurrency: string }) {
  return (
    <>
      {`${data.value / 100} ${counterCurrency}`}
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
        <FormattedDate date={data.date} format="LL" />
      </Box>
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
        <FormattedDate date={data.date} format="LT" />
      </Box>
    </>
  );
}
