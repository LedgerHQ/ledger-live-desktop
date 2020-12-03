// @flow

import React, { Component } from "react";
import { BigNumber } from "bignumber.js";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types";
import Chart from "~/renderer/components/Chart";
import { withTheme } from "styled-components";

type Props = {
  chartId: string,
  data: Array<*>,
  tickXScale: PortfolioRange,
  theme: any,
  magnitude: number,
};

class PlaceholderChart extends Component<Props> {
  shouldComponentUpdate(next: Props) {
    return next.tickXScale !== this.props.tickXScale;
  }

  render() {
    const { chartId, data, tickXScale, theme } = this.props;
    const themeType = theme.colors.palette.type;
    return (
      <Chart
        id={chartId}
        color={themeType === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
        data={data.map(i => ({
          ...i,
          value: BigNumber(
            10000 *
              (1 +
              0.1 * Math.sin(i.date * Math.cos(Number(i.date))) + // random-ish
                0.5 * Math.cos(i.date / 2000000000 + Math.sin(i.date / 1000000000))),
          ), // general curve trend
        }))}
        height={200}
        tickXScale={tickXScale}
        renderTickY={() => ""}
        magnitude={this.props.magnitude}
      />
    );
  }
}

export default withTheme(PlaceholderChart);
