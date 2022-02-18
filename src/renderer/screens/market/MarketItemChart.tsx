import React, { memo } from "react";
import { useTheme } from "styled-components";
import { SparklineSvgData } from "@ledgerhq/live-common/lib/market/types";

type Props = {
  sparklineIn7d: SparklineSvgData;
};

function SmallMarketItemChartComponent({ sparklineIn7d }: Props) {
  // @ts-expect-error to update with next live-common update
  const { path, viewBox, isPositive } = sparklineIn7d;

  const { colors } = useTheme();
  const color =
    isPositive !== undefined
      ? isPositive
        ? colors.success.c80
        : colors.error.c80
      : colors.neutral.c80;

  return (
    <svg
      style={{ transform: "rotate 180deg" }}
      viewBox={viewBox}
      fill="none"
      width="100%"
      height="100%"
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3px"
        d={path}
      />
    </svg>
  );
}

export const SmallMarketItemChart = memo<Props>(SmallMarketItemChartComponent);
