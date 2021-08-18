import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropdownUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 14.964L17.3279 9.612L16.7519 9.036L11.9999 13.764L7.24787 9.036L6.67188 9.612L11.9999 14.964Z"
        fill={color}
      />
    </svg>
  );
}

export default DropdownUltraLight;
