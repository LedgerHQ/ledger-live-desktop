import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledBottomLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 17.28L16.3439 12.936L15.5759 12.168L14.2079 13.56C13.6559 14.088 13.1279 14.64 12.5759 15.216V6.96H11.4239V15.24C10.8719 14.664 10.3439 14.112 9.79188 13.56L8.39988 12.168L7.65588 12.936L11.9999 17.28ZM2.87988 12C2.87988 17.088 6.91188 21.12 11.9999 21.12C17.1119 21.12 21.1199 16.968 21.1199 12C21.1199 6.912 17.0879 2.88 11.9999 2.88C6.91188 2.88 2.87988 6.912 2.87988 12ZM4.07988 12C4.07988 7.56 7.55988 4.08 11.9999 4.08C16.4399 4.08 19.9199 7.56 19.9199 12C19.9199 16.32 16.4399 19.92 11.9999 19.92C7.55988 19.92 4.07988 16.44 4.07988 12Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledBottomLight;
