import React, { useMemo, memo } from "react";

import { Chart } from "@ledgerhq/react-ui";

const weekStep = 7 * 24 * 60 * 60 * 1000;

type Props = {
  sparklineIn7d: number[];
  color?: string;
};

function SmallMarketItemChartComponent({ sparklineIn7d, color }: Props) {
  const data = useMemo(
    () =>
      sparklineIn7d.map((value, index, arr) => ({
        date: new Date(Date.now() - (weekStep / arr.length) * index),
        value,
      })),
    [sparklineIn7d],
  );

  return <Chart variant="small" data={data} color={color} />;
}

export const SmallMarketItemChart = memo<Props>(SmallMarketItemChartComponent);
