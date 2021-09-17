// @flow
import React from "react";
import { VictoryLine } from "victory";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCalculateMany } from "@ledgerhq/live-common/lib/countervalues/react";

type Props = {
  from: Currency,
  to: Currency,
  count: number,
  increment: number,
  width: number,
  height: number,
};

const GraphRate = ({ from, to, width, height, count, increment }: Props) => {
  const inputData = [];
  let t = Date.now() - count * increment;
  const value = 10 ** from.units[0].magnitude;
  for (let i = 0; i < count; i++) {
    const date = new Date(t);
    inputData.push({ date, value });
    t += increment;
  }
  const outputData = useCalculateMany(inputData, {
    from,
    to,
    disableRounding: true,
  });

  const isPriceGrowing = outputData[outputData.length - 1] - outputData[0] >= 0;

  const data = inputData.map(({ date }, i) => ( {
    date,
    value: outputData[i] || 0,
  }));

  return (
    <svg height={height} width={width}>
      <VictoryLine
        standalone={false}
        width={width}
        height={height}
        scale={{ x: "time" }}
        x="date"
        y="value"
        data={data}
        padding={5}
        style={{
          data: {
            stroke: isPriceGrowing ? "#66BE54" : "#EA2E49",
            strokeWidth: 1,
          },
        }}
      />
    </svg>
  );
};

export default GraphRate;
