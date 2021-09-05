import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronLeftRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0279 19.848L9.17992 12L17.0279 4.15197L15.9239 3.04797L6.97192 12L15.9239 20.952L17.0279 19.848Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronLeftRegular;
