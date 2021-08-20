import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronBottomRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.1521 6.97205L3.0481 8.07605L12.0001 17.028L20.9521 8.07605L19.8481 6.97205L12.0001 14.82L4.1521 6.97205Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronBottomRegular;
