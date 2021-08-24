import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WarningLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.20801 20.88H21.792L12 3.12L2.20801 20.88ZM4.17601 19.728L12 5.568L19.824 19.728H4.17601ZM11.064 18.24H12.912V16.392H11.064V18.24ZM11.4 12.144L11.496 14.88H12.504L12.624 12.144V9.864H11.4V12.144Z"
        fill={color}
      />
    </svg>
  );
}

export default WarningLight;
