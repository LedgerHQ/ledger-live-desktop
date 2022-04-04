// @flow
import React, { useMemo, memo, useCallback } from "react";
import { Flex, Text, Bar } from "@ledgerhq/react-ui";
import { SwitchTransition, Transition } from "react-transition-group";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import counterValueFormatter from "@ledgerhq/live-common/lib/market/utils/countervalueFormatter";
import FormattedVal from "~/renderer/components/FormattedVal";
import styled from "styled-components";
import Chart from "~/renderer/components/Chart";
import FormattedDate from "~/renderer/components/FormattedDate";
import ChartPlaceholder from "../assets/ChartPlaceholder";
import CountervalueSelect from "../CountervalueSelect";

const Title = styled(Text).attrs({ variant: "h3", color: "neutral.c100", mt: 1, mb: 5 })`
  font-size: 28px;
`;

const SubTitle = styled(Text).attrs({ variant: "large", color: "neutral.c80" })`
  font-size: 16px;
`;

const TooltipText = styled(Text).attrs({ variant: "body", color: "neutral.c100", mb: 1 })`
  font-size: 13px;
`;
const SubTooltipText = styled(Text).attrs({ variant: "small", color: "neutral.c60" })`
  font-size: 12px;
`;

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const FadeIn = styled.div.attrs<{ state: string }>(p => ({ style: transitionStyles[p.state] }))<{
  state: string;
}>`
  opacity: 0;
  transition: opacity 1s ease-out;
`;

const ranges = Object.keys(rangeDataTable);

function Tooltip({
  data,
  counterCurrency,
  locale,
}: {
  data: any;
  counterCurrency: string;
  locale: string;
}) {
  return (
    <Flex flexDirection="column" p={1}>
      <TooltipText variant="large">
        {counterValueFormatter({
          shorten: String(data.value).length > 7,
          currency: counterCurrency,
          value: data.value,
          locale,
        })}
      </TooltipText>
      <SubTooltipText>
        <FormattedDate date={data.date} format="LL" />
      </SubTooltipText>
      <SubTooltipText>
        <FormattedDate date={data.date} format="LT" />
      </SubTooltipText>
    </Flex>
  );
}

type Props = {
  price: number;
  priceChangePercentage: number;
  chartData: Record<string, number[]>;
  chartRequestParams: any;
  refreshChart: (params: any) => void;
  color?: string;
  t: any;
  locale: string;
  loading: boolean;
  setCounterCurrency: (currency: string) => void;
  supportedCounterCurrencies: string[];
};

function MarkeCoinChartComponent({
  chartData,
  price,
  priceChangePercentage,
  chartRequestParams,
  refreshChart,
  color,
  t,
  locale,
  loading,
  setCounterCurrency,
  supportedCounterCurrencies,
}: Props) {
  const { range, counterCurrency } = chartRequestParams;
  const { scale } = rangeDataTable[range];
  const activeRangeIndex = ranges.indexOf(range);
  const data = useMemo(() => {
    return chartData?.[range]
      ? chartData[range].map(([date, value]) => ({
          date: new Date(date),
          value,
        }))
      : [];
  }, [chartData, range]);

  const setRange = useCallback(
    index => {
      const newRange = ranges[index];
      if (range !== newRange) refreshChart({ range: newRange });
    },
    [refreshChart, range],
  );

  const valueArray = data.map(({ value }) => value);

  const suggestedMin = Math.min(...valueArray);
  const suggestedMax = Math.max(...valueArray);

  const renderTooltip = useCallback(
    (data: any) =>
      !loading && (
        <Tooltip data={data} counterCurrency={counterCurrency.toUpperCase()} locale={locale} />
      ),
    [counterCurrency, loading, locale],
  );

  return (
    <Flex py={6} flexDirection="column" alignContent="stretch">
      <Flex mb={2} flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Flex flexDirection="column">
          <SubTitle>{t("market.marketList.price")}</SubTitle>
          <Title>
            {counterValueFormatter({
              currency: counterCurrency,
              value: price,
              locale,
            })}
          </Title>
          <Flex>
            {priceChangePercentage && (
              <FormattedVal
                isPercent
                isNegative
                val={parseFloat(priceChangePercentage.toFixed(2))}
                inline
                withIcon
              />
            )}
          </Flex>
        </Flex>
        <Flex flexDirection="column" justifyContent="space-between">
          <Flex mb={3}>
            <CountervalueSelect
              data-test-id="market-coin-counter-value-select"
              counterCurrency={counterCurrency}
              setCounterCurrency={setCounterCurrency}
              supportedCounterCurrencies={supportedCounterCurrencies}
            />
          </Flex>
          <Bar
            data-test-id="market-coin-range-select"
            onTabChange={setRange}
            initialActiveIndex={activeRangeIndex}
          >
            {ranges
              .filter(k => k !== "1h")
              .map(key => (
                <Text color="inherit" variant="small" key={key}>
                  {t(`market.range.${key}`)}
                </Text>
              ))}
          </Bar>
        </Flex>
      </Flex>
      <SwitchTransition>
        <Transition
          key={loading || !data.length ? "loading" : "ready"}
          timeout={200}
          unmountOnExit
          mountOnEnter
        >
          {state => (
            <FadeIn state={state}>
              {loading || !data.length ? (
                <Flex height={250} color="neutral.c60">
                  <ChartPlaceholder />
                </Flex>
              ) : (
                <Chart
                  magnitude={1}
                  color={color}
                  data={data}
                  height={250}
                  width="100%"
                  loading={loading}
                  tickXScale={scale}
                  renderTickY={value =>
                    counterValueFormatter({
                      value,
                      shorten: String(value).length > 7,
                      locale,
                    })
                  }
                  renderTooltip={renderTooltip}
                  suggestedMin={suggestedMin}
                  suggestedMax={suggestedMax}
                  key={2}
                />
              )}
            </FadeIn>
          )}
        </Transition>
      </SwitchTransition>
    </Flex>
  );
}

export default memo<Props>(MarkeCoinChartComponent);
