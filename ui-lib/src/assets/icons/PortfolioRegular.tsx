import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PortfolioRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 19.92H21.3601V18.384H4.20014V4.07996H2.64014V19.92ZM5.83214 15.192L10.8961 10.176L13.7761 13.056L21.2401 5.59196L20.1841 4.53596L13.7761 10.944L10.8961 8.06396L5.83214 13.104V15.192Z"
        fill={color}
      />
    </svg>
  );
}

export default PortfolioRegular;
