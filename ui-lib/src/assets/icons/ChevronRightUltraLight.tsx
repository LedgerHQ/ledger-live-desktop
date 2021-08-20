import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronRightUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.35596 20.112L7.93196 20.688L16.644 12L7.93196 3.312L7.35596 3.888L15.444 12L7.35596 20.112Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronRightUltraLight;
