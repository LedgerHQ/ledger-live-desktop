import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowUpUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.35579 20.22L19.4758 5.1C19.4758 6.276 19.4518 7.452 19.4518 8.58V13.14H20.2198V3.78H10.8598V4.548H15.4198C16.5478 4.548 17.7238 4.524 18.8998 4.524L3.77979 19.644L4.35579 20.22Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowUpUltraLight;
