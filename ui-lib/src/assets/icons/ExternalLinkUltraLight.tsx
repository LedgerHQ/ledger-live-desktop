import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExternalLinkUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21L19.08 20.976V12H18.24V20.136L3.84 20.16V5.76H12V4.92H3V21ZM10.896 12.528L11.472 13.104L20.232 4.344V6.984V9.168H21V3H14.856V3.768H17.04H19.632L10.896 12.528Z"
        fill={color}
      />
    </svg>
  );
}

export default ExternalLinkUltraLight;
