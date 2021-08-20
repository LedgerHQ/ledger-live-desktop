import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowDownUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8598 20.22H20.2198V10.86L19.4518 10.836V15.396C19.4518 16.548 19.4758 17.724 19.4758 18.9L4.35579 3.78L3.77979 4.356L18.8998 19.476C17.7238 19.452 16.5478 19.452 15.4198 19.452H10.8598V20.22Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowDownUltraLight;
