import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CloseThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.728 19.392L12.336 12L19.728 4.60797L19.392 4.27197L12 11.664L4.60797 4.27197L4.27197 4.60797L11.664 12L4.27197 19.392L4.60797 19.728L12 12.336L19.392 19.728L19.728 19.392Z"
        fill={color}
      />
    </svg>
  );
}

export default CloseThin;
