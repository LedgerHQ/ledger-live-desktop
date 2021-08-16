import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ArrowRightRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7239 18.624L21.3719 12L14.7239 5.37598L13.7399 6.33598L17.0759 9.64798C17.6039 10.176 18.1799 10.728 18.7319 11.256H2.62793V12.744H18.7319C18.1799 13.272 17.6039 13.824 17.0759 14.352L13.7399 17.664L14.7239 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowRightRegular;
