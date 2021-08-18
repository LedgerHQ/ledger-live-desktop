import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BracketrightRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
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
          d="M20.4001 3.60006V-7.43994H3.6001V-4.99194H17.9521V3.60006H20.4001ZM3.6001 31.4401H20.4001V20.4001H17.9521V28.9921H3.6001V31.4401Z"
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

export default BracketrightRegular;
