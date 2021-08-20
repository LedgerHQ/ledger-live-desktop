import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronTopUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.88801 16.644L12 8.556L20.112 16.644L20.688 16.068L12 7.356L3.31201 16.068L3.88801 16.644Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronTopUltraLight;
