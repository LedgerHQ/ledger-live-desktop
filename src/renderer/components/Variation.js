// @flow
import React from "react";
import { VictoryLine } from "victory";

type Props = {
  variation: number[],
  width: number,
  height: number,
};

const Variation = ({ variation, width, height }: Props) => {
  const isPriceGrowing =
    variation.length > 0 && variation[variation.length - 1] - variation[0] >= 0;

  // console.log('VARIATION', variation)

  return (
    <svg height={height} width={width}>
      <VictoryLine
        standalone={false}
        width={width}
        height={height}
        scale={{ x: "time" }}
        x="date"
        y="value"
        data={variation}
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

export default Variation;
