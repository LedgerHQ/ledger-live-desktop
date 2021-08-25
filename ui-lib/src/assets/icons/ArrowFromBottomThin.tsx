import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowFromBottomThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.7601 4.032V17.04H12.2401V4.032L14.9281 6.72L17.1601 8.952L17.4961 8.616L12.0001 3.12L6.5041 8.616L6.8401 8.952L9.0721 6.72L11.7601 4.032ZM3.6001 20.88H20.4001V20.4H3.6001V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowFromBottomThin;
