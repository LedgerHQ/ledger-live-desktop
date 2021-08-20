import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowTopUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.592 4.116V21.372H12.408V4.116L14.856 6.588L18.072 9.804L18.624 9.252L12 2.628L5.37598 9.252L5.92798 9.804L9.14398 6.588L11.592 4.116Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowTopUltraLight;
