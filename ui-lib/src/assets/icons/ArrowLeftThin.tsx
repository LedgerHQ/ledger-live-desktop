import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowLeftThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.25193 18.624L9.58793 18.288L6.41993 15.12L3.53993 12.24H21.3719V11.76H3.53993L6.41993 8.87998L9.58793 5.71198L9.25193 5.37598L2.62793 12L9.25193 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowLeftThin;
