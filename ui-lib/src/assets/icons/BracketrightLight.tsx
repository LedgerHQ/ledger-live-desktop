import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function BracketrightLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M20.4001 3.6V-7.44H3.6001V-4.992H17.9521V3.6H20.4001ZM3.6001 31.44H20.4001V20.4H17.9521V28.992H3.6001V31.44Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width={24} height={24} fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
}

export default BracketrightLight;
