import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledCrossLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.78388 16.08L11.9999 12.84L15.2159 16.08L16.0799 15.216L12.8399 12L16.0799 8.78401L15.2159 7.92L11.9999 11.16L8.78388 7.92L7.91988 8.78401L11.1599 12L7.91988 15.216L8.78388 16.08ZM2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C16.4399 4.08 19.9199 7.56 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C7.55988 19.92 4.07988 16.44 4.07988 12Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledCrossLight;
