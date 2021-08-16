import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledPlusSolidLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12ZM6.62388 12.6V11.4H11.3759V6.624H12.6479L12.6239 11.4H17.3759V12.6H12.6239L12.6479 17.376H11.3759V12.6H6.62388Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledPlusSolidLight;
