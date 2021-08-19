import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledCheckSolidUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C17.04 21 21 16.896 21 12C21 6.96 17.04 3 12 3C6.96 3 3 6.96 3 12C3 17.04 6.96 21 12 21ZM7.224 11.352L7.824 10.752L11.184 14.112L16.872 8.424L17.472 9.024L11.184 15.312L7.224 11.352Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledCheckSolidUltraLight;
