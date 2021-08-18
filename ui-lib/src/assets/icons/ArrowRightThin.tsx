import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowRightThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7479 18.624L21.3719 12L14.7479 5.37598L14.4119 5.71198L17.5799 8.87998L20.4599 11.76H2.62793V12.24H20.4599L17.5799 15.12L14.4119 18.288L14.7479 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowRightThin;
