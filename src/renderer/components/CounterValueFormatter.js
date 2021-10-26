// @flow
import React from "react";
import Text from "~/renderer/components/Text";

export const CounterValueFormatter = ({
  currency,
  value,
  shorten,
}: {
  currency: string,
  value: number,
  shorten?: boolean,
}) => {
  if (!value) {
    return null;
  }

  const shortened = numShortener(value);

  if (shorten) {
    value = shortened.value;
  }
  return (
    <Text>
      {currency.length < 4
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(value)
        : `${currency.toUpperCase()} ${parseFloat(value)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`}
      {shorten && <Text ml={1}>{shortened.symbol}</Text>}
    </Text>
  );
};

function numShortener(num: number): { value: number, symbol: string } {
  if (num > 999 && num < 1000000) {
    return {
      value: parseInt((num / 1000).toFixed(2)),
      symbol: "K",
    };
  } else if (num >= 1000000000) {
    return {
      value: parseInt((num / 1000000000).toFixed(2)),
      symbol: "Bn",
    };
  } else if (num >= 1000000) {
    return {
      value: parseInt((num / 1000000).toFixed(2)),
      symbol: "M",
    };
  }
  return { value: num, symbol: "" };
}

export default CounterValueFormatter;
