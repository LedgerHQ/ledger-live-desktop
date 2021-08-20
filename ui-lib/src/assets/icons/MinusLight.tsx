import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MinusLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.4001 11.376H3.6001V12.624H20.4001V11.376Z" fill={color} />
    </svg>
  );
}

export default MinusLight;
