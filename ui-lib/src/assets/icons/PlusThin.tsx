import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PlusThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.4001 11.76H12.2401V3.60001H11.7601V11.76H3.6001V12.24H11.7601V20.4H12.2401V12.24H20.4001V11.76Z"
        fill={color}
      />
    </svg>
  );
}

export default PlusThin;
