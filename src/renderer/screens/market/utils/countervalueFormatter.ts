export const counterValueFormatter = ({
  currency,
  value,
  shorten,
  locale,
}: {
  currency?: string;
  value: number;
  shorten?: boolean;
  locale: string;
}) => {
  if (!value) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    style: currency ? "currency" : "decimal",
    currency,
    notation: shorten ? "compact" : "standard",
    maximumFractionDigits: 8,
  }).format(value);
};

export default counterValueFormatter;
