import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronLeftLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8361 19.968L8.86806 12L16.8361 4.00803L15.9961 3.16803L7.16406 12L15.9961 20.832L16.8361 19.968Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronLeftLight;
