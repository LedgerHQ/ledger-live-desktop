import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronLeftThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4521 20.232L8.2201 12L16.4521 3.76801L16.1161 3.43201L7.5481 12L16.1161 20.568L16.4521 20.232Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronLeftThin;
