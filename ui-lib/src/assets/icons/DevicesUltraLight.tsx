import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DevicesUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.75996 21.36H12.624V20.544H5.80796C5.20796 20.544 4.79996 20.136 4.79996 19.536V4.44C4.79996 3.84 5.20796 3.456 5.80796 3.456H15.432C16.032 3.456 16.44 3.84 16.44 4.44V6.984H17.28V4.44C17.28 3.456 16.464 2.64 15.48 2.64H5.75996C4.77596 2.64 3.95996 3.456 3.95996 4.44V19.56C3.95996 20.544 4.77596 21.36 5.75996 21.36ZM14.4 21.36H20.04V8.76H14.4V21.36ZM15.216 20.544V9.576H19.224V20.544H15.216Z"
        fill={color}
      />
    </svg>
  );
}

export default DevicesUltraLight;
