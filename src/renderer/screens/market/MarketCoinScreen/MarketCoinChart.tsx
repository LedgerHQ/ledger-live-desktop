// @flow
import React, { useMemo, memo, useCallback } from "react";
import { Flex, Text, Bar } from "@ledgerhq/react-ui";
import { rangeDataTable } from "../utils/rangeDataTable";
import counterValueFormatter from "../utils/countervalueFormatter";
import FormattedVal from "~/renderer/components/FormattedVal";
import styled from "styled-components";
import Chart from "~/renderer/components/Chart";
import FormattedDate from "~/renderer/components/FormattedDate";

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
          counterCurrency,
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
}: Props) {
  const { range, counterCurrency } = chartRequestParams;
  const { scale, mockData = [] } = rangeDataTable[range];
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
      <Flex mb={2} flexDirection="row" justifyContent="space-between" alignItems="baseline">
        <Flex flexDirection="column">
          <SubTitle>{t("market.marketList.price")}</SubTitle>
          <Title>
            {counterValueFormatter({
              counterCurrency,
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
        <Bar onTabChange={setRange} initialActiveIndex={activeRangeIndex}>
          {ranges.map(key => (
            <Text color="inherit" variant="small" key={key}>
              {t(`market.range.${key}`)}
            </Text>
          ))}
        </Bar>
      </Flex>
      <Chart
        magnitude={1}
        color={color}
        data={data}
        height={250}
        width="100%"
        loading={loading}
        tickXScale={scale}
        renderTickY={val => val}
        renderTooltip={renderTooltip}
        suggestedMin={suggestedMin}
        suggestedMax={suggestedMax}
        key={2}
      />
    </Flex>
  );
}

export default memo<Props>(MarkeCoinChartComponent);
