import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ZeroCircledMediLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.704C14.352 16.704 15.576 14.856 15.576 12.024C15.576 9.168 14.376 7.34401 12 7.34401C9.67201 7.34401 8.42401 9.19201 8.42401 12.024C8.42401 14.856 9.67201 16.704 12 16.704ZM5.76001 21.12H18.24V19.92H5.76001V21.12ZM5.76001 4.08H18.24V2.88H5.76001V4.08ZM9.67201 12.6V11.472C9.67201 9.288 10.392 8.376 12 8.376C12.888 8.376 13.488 8.64001 13.872 9.264L9.79201 13.896C9.72001 13.512 9.67201 13.104 9.67201 12.6ZM10.104 14.784L14.208 10.152C14.28 10.512 14.328 10.968 14.328 11.472V12.6C14.328 14.784 13.608 15.672 12 15.672C11.112 15.672 10.488 15.408 10.104 14.784Z"
        fill={color}
      />
    </svg>
  );
}

export default ZeroCircledMediLight;
