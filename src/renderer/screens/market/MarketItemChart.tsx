import React, { memo } from "react";
import { SparklineSvgData } from "@ledgerhq/live-common/lib/market/types";

type Props = {
  sparklineIn7d: SparklineSvgData;
  color?: string;
};

function SmallMarketItemChartComponent({ sparklineIn7d, color }: Props) {
  const { path, viewBox } = sparklineIn7d;

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
