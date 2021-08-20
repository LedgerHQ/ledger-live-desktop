import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledCheckThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 20.88C16.9681 20.88 20.8801 16.848 20.8801 12C20.8801 7.032 16.9681 3.12 12.0001 3.12C7.03212 3.12 3.12012 7.032 3.12012 12C3.12012 16.968 7.03212 20.88 12.0001 20.88ZM3.60012 12C3.60012 7.296 7.29612 3.6 12.0001 3.6C16.7041 3.6 20.4001 7.296 20.4001 12C20.4001 16.584 16.7041 20.4 12.0001 20.4C7.29612 20.4 3.60012 16.704 3.60012 12ZM8.06412 11.952L11.1841 15.072L16.6321 9.624L16.2961 9.288L11.1841 14.4L8.40012 11.616L8.06412 11.952Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledCheckThin;
