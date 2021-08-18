import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ThreeCircledMediUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9758 16.68C13.8478 16.68 15.2158 15.576 15.2158 14.016C15.2158 13.008 14.6398 12.192 13.4638 11.88V11.76C14.5678 11.448 14.9518 10.704 14.9518 9.888C14.9518 8.424 13.6798 7.32 11.9998 7.32C10.1998 7.32 8.95177 8.568 8.95177 10.128V10.296H9.79177C9.79177 8.88 10.5358 8.088 11.9998 8.088C13.3678 8.088 14.1118 8.76 14.1118 9.936C14.1118 10.896 13.7518 11.472 11.9038 11.472H11.2078V12.24H11.9038C13.7518 12.24 14.3758 12.864 14.3758 13.992C14.3758 15.216 13.5358 15.888 11.9758 15.888C10.3438 15.888 9.64777 15.12 9.64777 13.56H8.80777V13.68C8.80777 15.408 10.0078 16.68 11.9758 16.68ZM5.75977 21H18.2398V20.16H5.75977V21ZM5.75977 3.84H18.2398V3H5.75977V3.84Z"
        fill={color}
      />
    </svg>
  );
}

export default ThreeCircledMediUltraLight;
