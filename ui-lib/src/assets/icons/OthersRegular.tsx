import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OthersRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8081 13.296H20.4001V10.704H17.8081V13.296ZM3.6001 13.296H6.1921V10.704H3.6001V13.296ZM10.7041 13.296H13.2961V10.704H10.7041V13.296Z"
        fill={color}
      />
    </svg>
  );
}

export default OthersRegular;
