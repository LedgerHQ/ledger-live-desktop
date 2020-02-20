// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { portfolioSelector } from "~/renderer/actions/portfolio";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type { Currency, PortfolioRange, Portfolio } from "@ledgerhq/live-common/lib/types";

import Chart from "~/renderer/components/Chart2";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import PlaceholderChart from "~/renderer/components/PlaceholderChart";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import BalanceInfos from "~/renderer/components/BalanceInfos";
import type { TFunction } from "react-i18next";

type OwnProps = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  range: PortfolioRange,
  t: TFunction,
  selectedTimeRange: string,
  handleChangeSelectedTime: any => void,
};

type Props = {
  ...OwnProps,
  discreetMode: boolean,
  portfolio: Portfolio,
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

class PortfolioBalanceSummary extends PureComponent<Props> {
  renderTickY = (val: number) => formatShort(this.props.counterValue.units[0], BigNumber(val));

  renderTooltip = (d: any) => <Tooltip d={d} counterValue={this.props.counterValue} />;

  render() {
    const {
      portfolio,
      range,
      chartColor,
      chartId,
      discreetMode,
      counterValue,
      selectedTimeRange,
      handleChangeSelectedTime,
      t,
    } = this.props;
    return (
      <Card p={0} py={5}>
        <Box px={6} data-e2e="dashboard_graph">
          <BalanceInfos
            t={t}
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
              onlyUpdateIfLastPointChanges
              id={chartId}
              color={chartColor}
              data={portfolio.balanceHistory}
              height={250}
              tickXScale={range}
              renderTickY={discreetMode ? () => "" : this.renderTickY}
              isInteractive
              renderTooltip={this.renderTooltip}
            />
          ) : (
            <PlaceholderChart
              chartId={chartId}
              data={portfolio.balanceHistory}
              tickXScale={range}
            />
          )}
        </Box>
      </Card>
    );
  }
}

const ConnectedBalanceSummary: React$ComponentType<OwnProps> = connect(
  createStructuredSelector({
    portfolio: portfolioSelector,
    discreetMode: discreetModeSelector,
  }),
)(PortfolioBalanceSummary);

export default ConnectedBalanceSummary;
