import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronTopLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.03197 16.836L12 8.844L19.968 16.836L20.832 15.972L12 7.164L3.16797 15.972L4.03197 16.836Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronTopLight;
