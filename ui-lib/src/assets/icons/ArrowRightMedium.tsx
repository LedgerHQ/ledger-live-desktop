import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowRightMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7239 18.624L21.3719 12L14.7239 5.37598L13.5239 6.55198L16.9079 9.91198C17.2919 10.296 17.7239 10.704 18.1559 11.088H2.62793V12.912H18.1559C17.7239 13.296 17.2919 13.704 16.9079 14.088L13.5239 17.448L14.7239 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowRightMedium;
