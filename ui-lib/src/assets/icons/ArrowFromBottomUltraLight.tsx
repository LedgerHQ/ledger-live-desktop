import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowFromBottomUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5921 4.548V16.98H12.4081V4.548C13.1761 5.316 13.9681 6.108 14.7121 6.876L16.9441 9.108L17.4961 8.556L12.0001 3.06L6.5041 8.556L7.0561 9.108L9.2881 6.876L11.5921 4.548ZM3.6001 20.94H20.4001V20.1H3.6001V20.94Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowFromBottomUltraLight;
