import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ListThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.71988 6.72001H21.1199V6.24001H6.71988V6.72001ZM2.87988 18.24H4.31988V16.8H2.87988V18.24ZM2.87988 12.72H4.31988V11.28H2.87988V12.72ZM2.87988 7.20001H4.31988V5.76001H2.87988V7.20001ZM6.71988 17.76H21.1199V17.28H6.71988V17.76ZM6.71988 12.24H21.1199V11.76H6.71988V12.24Z"
        fill={color}
      />
    </svg>
  );
}

export default ListThin;
