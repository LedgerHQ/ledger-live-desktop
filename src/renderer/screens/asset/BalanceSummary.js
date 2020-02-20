// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { BigNumber } from "bignumber.js";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type {
  CryptoCurrency,
  Currency,
  PortfolioRange,
  TokenCurrency,
  Unit,
} from "@ledgerhq/live-common/lib/types";

import Chart from "~/renderer/components/Chart2";
import Box, { Card } from "~/renderer/components/Box";
import moment from "moment";
import FormattedVal from "~/renderer/components/FormattedVal";
import { createStructuredSelector } from "reselect";
import { currencyPortfolioSelector } from "~/renderer/actions/portfolio";
import AssetBalanceSummaryHeader from "./AssetBalanceSummaryHeader";
import { discreetModeSelector } from "~/renderer/reducers/settings";

type OwnProps = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  currency: CryptoCurrency | TokenCurrency,
  unit: Unit,
  range: PortfolioRange,
  countervalueFirst: boolean,
};

type Props = {
  ...OwnProps,
  portfolio: *,
  discreetMode: boolean,
};

const mapStateToProps = createStructuredSelector({
  portfolio: currencyPortfolioSelector,
  discreetMode: discreetModeSelector,
});

class BalanceSummary extends PureComponent<Props> {
  // $FlowFixMe
  mapValueCounterValue = (d: any) => d.countervalue.toNumber();
  mapValueCryptoValue = (d: any) => d.value.toNumber();

  renderTooltip = (d: any) => {
    const {
      unit,
      counterValue,
      portfolio: { history, countervalueAvailable },
      countervalueFirst,
    } = this.props;

    const displayCountervalue = countervalueFirst && history.countervalueAvailable;
    const data = [
      { val: d.value, unit },
      { val: d.countervalue, unit: counterValue.units[0] },
    ];
    if (displayCountervalue) data.reverse();
    return (
      <>
        <FormattedVal fontSize={5} color="palette.text.shade100" showCode {...data[0]} />
        {countervalueAvailable ? (
          <FormattedVal fontSize={4} color="warmGrey" showCode {...data[1]} />
        ) : null}
        <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
          {moment(d.date).format("LL")}
        </Box>
      </>
    );
  };

  renderTickYCryptoValue = (val: number) => formatShort(this.props.unit, BigNumber(val));
  renderTickYCounterValue = (val: number) =>
    formatShort(this.props.counterValue.units[0], BigNumber(val));

  render() {
    const {
      range,
      chartColor,
      chartId,
      countervalueFirst,
      portfolio,
      counterValue,
      currency,
      unit,
      discreetMode,
    } = this.props;
    const displayCountervalue = countervalueFirst && portfolio.countervalueAvailable;
    return (
      <Card p={0} py={5}>
        <Box px={6}>
          <AssetBalanceSummaryHeader
            currency={currency}
            unit={unit}
            counterValue={counterValue}
            selectedTimeRange={range}
            countervalueChange={portfolio.countervalueChange}
            cryptoChange={portfolio.cryptoChange}
            last={portfolio.history[portfolio.history.length - 1]}
            isAvailable={portfolio.countervalueAvailable}
            countervalueFirst={displayCountervalue}
          />
        </Box>

        <Box px={5} ff="Inter" fontSize={4} color="palette.text.shade80" pt={6}>
          <Chart
            id={chartId}
            color={chartColor}
            data={portfolio.history}
            height={200}
            tickXScale={range}
            valueKey={displayCountervalue ? "countervalue" : "value"}
            mapValue={displayCountervalue ? this.mapValueCounterValue : this.mapValueCryptoValue}
            renderTickY={
              discreetMode
                ? () => ""
                : displayCountervalue
                ? this.renderTickYCounterValue
                : this.renderTickYCryptoValue
            }
            isInteractive
            renderTooltip={this.renderTooltip}
          />
        </Box>
      </Card>
    );
  }
}
const ConnectedBalanceSummary: React$ComponentType<OwnProps> = connect(mapStateToProps)(
  BalanceSummary,
);

export default ConnectedBalanceSummary;
