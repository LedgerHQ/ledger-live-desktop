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

  let shortenerSymbol: string = "";
  if (shorten) {
    const { value: shortenedValue, symbol } = numShortener(value);
    value = shortenedValue;
    shortenerSymbol = symbol;
  }
  return (
    <Text>
      {currency.length < 4
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(value)
        : `${currency.toUpperCase()} ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`}
      {shorten && <Text ml={1}>{shortenerSymbol}</Text>}
    </Text>
  );
};

function numShortener(num) {
  if (num > 999 && num < 1000000) {
    return {
      value: (num / 1000).toFixed(2),
      symbol: "K",
    }; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000000) {
    return {
      value: (num / 1000000000).toFixed(2),
      symbol: "Bn",
    }; // convert to M for number from > 1 million
  } else if (num >= 1000000) {
    return {
      value: (num / 1000000).toFixed(2),
      symbol: "M",
    }; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
}

export default CounterValueFormatter;
