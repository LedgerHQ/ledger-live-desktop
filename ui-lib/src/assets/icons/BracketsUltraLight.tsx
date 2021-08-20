import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BracketsUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.8001 10.2H20.6401V3.36H13.8001V4.2H19.8001V10.2ZM3.36011 20.64H10.2001V19.8H4.20011V13.776H3.36011V20.64ZM3.36011 10.2H4.20011V4.2H10.2001V3.36H3.36011V10.2ZM13.8001 20.64H20.6401V13.8H19.8001V19.8H13.8001V20.64Z"
        fill={color}
      />
    </svg>
  );
}

export default BracketsUltraLight;
