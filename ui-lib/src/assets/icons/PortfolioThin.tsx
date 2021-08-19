import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PortfolioThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 19.92H21.3601V19.44H3.12014V4.07999H2.64014V19.92ZM4.56014 15.744L10.8961 9.45599L13.7761 12.336L20.8801 5.23199L20.5441 4.89599L13.7761 11.664L10.8961 8.78399L4.56014 15.072V15.744Z"
        fill={color}
      />
    </svg>
  );
}

export default PortfolioThin;
