import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledCheckSolidRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24ZM6.98377 11.568L8.08777 10.488L11.1838 13.56L16.6078 8.16001L17.6878 9.26401L11.1838 15.792L6.98377 11.568Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledCheckSolidRegular;
