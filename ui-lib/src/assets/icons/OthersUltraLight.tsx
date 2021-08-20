import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OthersUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.5761 12.912H20.4001V11.088H18.5761V12.912ZM3.6001 12.912H5.4241V11.088H3.6001V12.912ZM11.0881 12.912H12.9121V11.088H11.0881V12.912Z"
        fill={color}
      />
    </svg>
  );
}

export default OthersUltraLight;
