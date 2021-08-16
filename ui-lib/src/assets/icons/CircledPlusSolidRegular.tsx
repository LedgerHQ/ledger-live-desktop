import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CircledPlusSolidRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24ZM6.62377 12.768V11.208H11.1838V6.62401H12.8398L12.8158 11.208H17.3758V12.768H12.8158L12.8398 17.376H11.1838V12.768H6.62377Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledPlusSolidRegular;
