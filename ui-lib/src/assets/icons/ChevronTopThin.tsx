import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronTopThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.76788 16.452L11.9999 8.21997L20.2319 16.452L20.5679 16.116L11.9999 7.54797L3.43188 16.116L3.76788 16.452Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronTopThin;
