import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExportRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75977 20.58H21.2398V13.5H19.6798V19.02H4.31977V13.5H2.75977V20.58ZM7.65577 7.76404L8.63977 8.72404L9.91177 7.47604C10.3438 7.02004 10.8238 6.54004 11.2558 6.06004V16.38H12.7438V6.01204C13.1998 6.51604 13.6558 6.99604 14.1118 7.47604L15.4078 8.72404L16.3678 7.76404L11.9998 3.42004L7.65577 7.76404Z"
        fill={color}
      />
    </svg>
  );
}

export default ExportRegular;
