import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowFromBottomLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4241 5.064V16.92H12.5761V5.04C13.2241 5.712 13.8721 6.384 14.5201 7.032L16.7521 9.24L17.4961 8.496L12.0001 3L6.5041 8.496L7.2721 9.24L9.5041 7.032L11.4241 5.064ZM3.6001 21H20.4001V19.8H3.6001V21Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowFromBottomLight;
