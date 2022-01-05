// @flow
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type {
  CryptoCurrency,
  Currency,
  TokenCurrency,
  Unit,
} from "@ledgerhq/live-common/lib/types";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import Chart from "~/renderer/components/Chart";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import { useCurrencyPortfolio } from "~/renderer/actions/portfolio";
import AssetBalanceSummaryHeader from "./AssetBalanceSummaryHeader";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import FormattedDate from "~/renderer/components/FormattedDate";

type Props = {
  counterValue: Currency,
  chartColor: string,
  currency: CryptoCurrency | TokenCurrency,
  unit: Unit,
  range: PortfolioRange,
  countervalueFirst: boolean,
};

export default function BalanceSummary({
  unit,
  counterValue,
  countervalueFirst,
  range,
  chartColor,
  currency,
}: Props) {
  const {
    history,
    countervalueAvailable,
    countervalueChange,
    cryptoChange,
  } = useCurrencyPortfolio({ currency, range });
  const discreetMode = useSelector(discreetModeSelector);

  const mapValueCounterValue = useCallback((d: any) => d.countervalue, []);
  const mapValueCryptoValue = useCallback((d: any) => d.value, []);

  const displayCountervalue = countervalueFirst && countervalueAvailable;
  const chartMagnitude = displayCountervalue ? counterValue.units[0].magnitude : unit.magnitude;

  const renderTooltip = useCallback(
    (d: any) => {
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
            <FormattedDate date={d.date} format="L" />
          </Box>
        </>
      );
    },
    [counterValue.units, countervalueAvailable, displayCountervalue, unit],
  );

  const renderTickYCryptoValue = useCallback((val: number) => formatShort(unit, BigNumber(val)), [
    unit,
  ]);
  const renderTickYCounterValue = useCallback(
    (val: number) => formatShort(counterValue.units[0], BigNumber(val)),
    [counterValue.units],
  );

  return (
    <Card p={0} py={5}>
      <Box px={6}>
        <AssetBalanceSummaryHeader
          currency={currency}
          unit={unit}
          counterValue={counterValue}
          countervalueChange={countervalueChange}
          cryptoChange={cryptoChange}
          last={history[history.length - 1]}
          isAvailable={countervalueAvailable}
          countervalueFirst={displayCountervalue}
        />
      </Box>

      <Box px={5} ff="Inter" fontSize={4} color="palette.text.shade80" pt={6}>
        <Chart
          magnitude={chartMagnitude}
          color={chartColor}
          // $FlowFixMe TODO make date non optional
          data={history}
          height={200}
          tickXScale={range}
          valueKey={displayCountervalue ? "countervalue" : "value"}
          mapValue={displayCountervalue ? mapValueCounterValue : mapValueCryptoValue}
          renderTickY={
            discreetMode
              ? () => ""
              : displayCountervalue
              ? renderTickYCounterValue
              : renderTickYCryptoValue
          }
          isInteractive
          renderTooltip={renderTooltip}
        />
      </Box>
    </Card>
  );
}
