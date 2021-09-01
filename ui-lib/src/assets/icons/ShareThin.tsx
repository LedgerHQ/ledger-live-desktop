import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShareThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.08008 20.4H19.9201V12H16.3201V12.48H19.4401V19.92H4.56008V12.48H7.68008V12H4.08008V20.4ZM7.65608 7.94401L7.99208 8.28001L9.86408 6.40801L11.7601 4.51201V16.56H12.2401V4.51201L14.1361 6.40801L16.0081 8.28001L16.3441 7.94401L12.0001 3.60001L7.65608 7.94401Z"
        fill={color}
      />
    </svg>
  );
}

export default ShareThin;
