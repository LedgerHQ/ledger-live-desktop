import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronRightThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5481 20.232L7.8841 20.568L16.4521 12L7.8841 3.43201L7.5481 3.76801L15.7801 12L7.5481 20.232Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronRightThin;
