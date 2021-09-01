import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronRightLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.16406 19.968L8.00406 20.832L16.8361 12L8.00406 3.16803L7.16406 4.00803L15.1321 12L7.16406 19.968Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronRightLight;
