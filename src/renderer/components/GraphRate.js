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

  const data = inputData.map(({ date }, i) => ( {
    date,
    value: outputData[i] || 0,
  } ));

  data[0].date = new Date("2020-01-01T00:00:00Z");
  data[0].value = 10

  data[1].date = new Date("2020-04-01T00:00:00Z")
  data[1].value = 10

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
            stroke: "#333",
            strokeWidth: 1,
          },
        }}
      />
    </svg>
  );
};

export default GraphRate;
