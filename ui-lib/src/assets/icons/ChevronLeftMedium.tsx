import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronLeftMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.22 19.728L9.51603 12L17.22 4.27198L15.876 2.92798L6.78003 12L15.876 21.072L17.22 19.728Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronLeftMedium;
