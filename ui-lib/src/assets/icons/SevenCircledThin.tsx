import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SevenCircledThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 20.88C16.9681 20.88 20.8801 16.848 20.8801 12C20.8801 7.032 16.9681 3.12 12.0001 3.12C7.03212 3.12 3.12012 7.032 3.12012 12C3.12012 16.968 7.03212 20.88 12.0001 20.88ZM3.60012 12C3.60012 7.296 7.29612 3.6 12.0001 3.6C16.7041 3.6 20.4001 7.296 20.4001 12C20.4001 16.584 16.7041 20.4 12.0001 20.4C7.29612 20.4 3.60012 16.704 3.60012 12ZM8.76012 8.064H14.6401V8.424C12.4081 10.392 11.0641 13.2 10.6801 16.44H11.2081C11.5921 13.176 12.9601 10.464 15.1201 8.64V7.584H8.76012V8.064Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledThin;
