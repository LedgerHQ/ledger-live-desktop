import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronTopRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.1521 17.028L12.0001 9.18005L19.8481 17.028L20.9521 15.924L12.0001 6.97205L3.0481 15.924L4.1521 17.028Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronTopRegular;
