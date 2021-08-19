import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronBottomUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.88801 7.356L3.31201 7.932L12 16.644L20.688 7.932L20.112 7.356L12 15.444L3.88801 7.356Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronBottomUltraLight;
