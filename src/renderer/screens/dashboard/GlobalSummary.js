// @flow

import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { usePortfolio } from "~/renderer/actions/portfolio";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type { Currency, PortfolioRange } from "@ledgerhq/live-common/lib/types";

import Chart from "~/renderer/components/Chart2";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import PlaceholderChart from "~/renderer/components/PlaceholderChart";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import BalanceInfos from "~/renderer/components/BalanceInfos";

type Props = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  range: PortfolioRange,
  selectedTimeRange: string,
  handleChangeSelectedTime: any => void,
};

const Tooltip = ({ counterValue, d }: *) => (
  <>
    <FormattedVal
      alwaysShowSign={false}
      fontSize={5}
      color="palette.text.shade100"
      showCode
      unit={counterValue.units[0]}
      val={d.value}
    />
    <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
      {moment(d.date).format("LL")}
    </Box>
  </>
);

export default function PortfolioBalanceSummary({
  range,
  chartColor,
  chartId,
  counterValue,
  selectedTimeRange,
  handleChangeSelectedTime,
}: Props) {
  const portfolio = usePortfolio();
  const discreetMode = useSelector(discreetModeSelector);

  const renderTickY = useCallback(
    (val: number) => formatShort(counterValue.units[0], BigNumber(val)),
    [counterValue],
  );

  const renderTooltip = useCallback((d: any) => <Tooltip d={d} counterValue={counterValue} />, [
    counterValue,
  ]);

  return (
    <Card p={0} py={5}>
      <Box px={6} data-e2e="dashboard_graph">
        <BalanceInfos
          unit={counterValue.units[0]}
          isAvailable={portfolio.balanceAvailable}
          since={selectedTimeRange}
          valueChange={portfolio.countervalueChange}
          totalBalance={portfolio.balanceHistory[portfolio.balanceHistory.length - 1].value}
          handleChangeSelectedTime={handleChangeSelectedTime}
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
        {portfolio.balanceAvailable ? (
          <Chart
            magnitude={counterValue.units[0].magnitude}
            color={chartColor}
            data={portfolio.balanceHistory}
            height={250}
            tickXScale={range}
            renderTickY={discreetMode ? () => "" : renderTickY}
            renderTooltip={renderTooltip}
          />
        ) : (
          <PlaceholderChart chartId={chartId} data={portfolio.balanceHistory} tickXScale={range} />
        )}
      </Box>
    </Card>
  );
}
