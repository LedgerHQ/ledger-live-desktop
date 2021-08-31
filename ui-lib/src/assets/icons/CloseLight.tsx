import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CloseLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.0159 19.104L12.9119 12L20.0159 4.89601L19.1039 3.98401L11.9999 11.088L4.89589 3.98401L3.98389 4.89601L11.0879 12L3.98389 19.104L4.89589 20.016L11.9999 12.912L19.1039 20.016L20.0159 19.104Z"
        fill={color}
      />
    </svg>
  );
}

export default CloseLight;
