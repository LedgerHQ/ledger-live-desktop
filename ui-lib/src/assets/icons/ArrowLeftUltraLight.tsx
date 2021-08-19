import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowLeftUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.25193 18.624L9.80393 18.072L6.58793 14.856C5.77193 14.04 4.95593 13.224 4.11593 12.408H21.3719V11.592H4.11593C4.95593 10.776 5.77193 9.96 6.58793 9.144L9.80393 5.928L9.25193 5.376L2.62793 12L9.25193 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowLeftUltraLight;
