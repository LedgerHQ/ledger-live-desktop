import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowRightUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7479 18.624L21.3719 12L14.7479 5.376L14.1959 5.928L17.4119 9.144L19.8839 11.592H2.62793V12.408H19.8839L17.4119 14.856L14.1959 18.072L14.7479 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowRightUltraLight;
