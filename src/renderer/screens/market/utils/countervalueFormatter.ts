function numShortener(num: number): { value: number; symbol: string } {
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

export const counterValueFormatter = ({
  counterCurrency,
  currency = "",
  value,
  shorten,
  locale,
}: {
  counterCurrency: string;
  currency?: string;
  value: number;
  shorten?: boolean;
  locale: string;
}) => {
  if (!value) {
    return "-";
  }

  let shortened: any = {};

  if (shorten) {
    shortened = numShortener(value);
    value = shortened?.value;
  }

  return `${
    counterCurrency
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: counterCurrency,
        }).format(value)
      : `${currency.toUpperCase()} ${value.toLocaleString(locale)}`
  } ${shortened?.symbol ?? ""}`;
};

export default counterValueFormatter;
