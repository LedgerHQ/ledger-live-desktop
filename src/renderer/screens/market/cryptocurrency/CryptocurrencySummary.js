// @flow
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type { BalanceHistoryData, Currency } from "@ledgerhq/live-common/lib/types";
import Chart from "~/renderer/components/Chart";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import FormattedDate from "~/renderer/components/FormattedDate";
import type { CurrencyType } from "~/renderer/reducers/market";
import CryptocurrencySummaryHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummaryHeader";

type Props = {
  chartColor: string,
  currency: CurrencyType,
  range: string,
  counterValue: any,
};

export default function CryptocurrencySummary({
  chartColor,
  currency,
  range,
  counterValue,
}: Props) {
  const discreetMode = useSelector(discreetModeSelector);

  const renderTickY = useCallback(
    (val: number) => formatShort(counterValue.currency.units[0], BigNumber(val)),
    [counterValue, range],
  );

  const renderTooltip = useCallback(
    (data: BalanceHistoryData) => <Tooltip data={data} counterValue={counterValue} range={range} />,
    [counterValue, range],
  );

  return (
    <Card p={0} py={5}>
      <Box px={6} data-e2e="dashboard_graph">
        <CryptocurrencySummaryHeader currency={currency} counterValue={counterValue} />
        {/* <BalanceInfos */}
        {/*  unit={counterValue.units[0]} */}
        {/*  isAvailable={portfolio.balanceAvailable} */}
        {/*  since={selectedTimeRange} */}
        {/*  valueChange={portfolio.countervalueChange} */}
        {/*  totalBalance={portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value} */}
        {/*  handleChangeSelectedTime={handleChangeSelectedTime} */}
        {/* /> */}
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
          magnitude={currency.units[0].magnitude}
          color={chartColor}
          data={currency.variation}
          height={250}
          tickXScale={range}
          renderTickY={discreetMode ? () => "" : renderTickY}
          renderTooltip={renderTooltip}
        />
        {/* ) : ( */}
        {/*  <PlaceholderChart */}
        {/*    magnitude={counterValue.units[0].magnitude} */}
        {/*    chartId={chartId} */}
        {/*    data={portfolio.balanceHistory} */}
        {/*    tickXScale={range} */}
        {/*  /> */}
        {/* )} */}
      </Box>
    </Card>
  );
}

function Tooltip({ data, counterValue }: { data: BalanceHistoryData, counterValue: Currency }) {
  return (
    <>
      <FormattedVal
        alwaysShowSign={false}
        fontSize={5}
        color="palette.text.shade100"
        showCode
        unit={counterValue.currency.units[0]}
        val={data.value}
      />
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
        <FormattedDate date={data.date} format="LL" />
      </Box>
      <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
        <FormattedDate date={data.date} format="LT" />
      </Box>
    </>
  );
}
