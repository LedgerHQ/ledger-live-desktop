import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WarningThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.73584 20.4H21.2638L11.9998 3.60001L2.73584 20.4ZM3.52784 19.92L11.9998 4.56001L20.4718 19.92H3.52784ZM11.2798 18.24H12.7198V16.8H11.2798V18.24ZM11.7598 15.168H12.2398V9.36001H11.7598V15.168Z"
        fill={color}
      />
    </svg>
  );
}

export default WarningThin;
