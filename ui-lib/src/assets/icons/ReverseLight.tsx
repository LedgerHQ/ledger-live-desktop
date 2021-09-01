import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ReverseLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.24C16.9919 21.24 21.1199 17.112 21.1199 12.12C21.1199 7.12801 16.9919 3.00001 11.9999 3.00001C8.95188 3.00001 6.26388 4.56001 4.63188 6.98401C4.65588 6.26401 4.65588 5.52001 4.65588 4.84801V2.76001H3.57588V8.90401H9.71988V7.82401H7.63188C6.88788 7.82401 6.09588 7.82401 5.37588 7.84801C6.79188 5.66401 9.21588 4.20001 11.9999 4.20001C16.3439 4.20001 19.9199 7.77601 19.9199 12.12C19.9199 16.44 16.3199 20.04 11.9999 20.04C7.65588 20.04 4.07988 16.44 4.07988 12.12H2.87988C2.87988 17.112 7.00788 21.24 11.9999 21.24Z"
        fill={color}
      />
    </svg>
  );
}

export default ReverseLight;
