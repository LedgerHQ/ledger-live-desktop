import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CloseUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.8719 19.248L12.6239 12L19.8719 4.752L19.2479 4.128L11.9999 11.376L4.75193 4.128L4.12793 4.752L11.3759 12L4.12793 19.248L4.75193 19.872L11.9999 12.624L19.2479 19.872L19.8719 19.248Z"
        fill={color}
      />
    </svg>
  );
}

export default CloseUltraLight;
