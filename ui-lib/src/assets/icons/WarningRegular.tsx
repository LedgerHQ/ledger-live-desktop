import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function WarningRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.94385 21.12H22.0558L11.9998 2.88L1.94385 21.12ZM4.51185 19.656L11.9998 6.072L19.4878 19.656H4.51185ZM10.9678 18.24H13.0078V16.2H10.9678V18.24ZM11.2078 12.216L11.3758 14.76H12.6238L12.7918 12.216V10.128H11.2078V12.216Z"
        fill={color}
      />
    </svg>
  );
}

export default WarningRegular;
