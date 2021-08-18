import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BracketsThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9201 10.2H20.4001V3.59998H13.8001V4.07998H19.9201V10.2ZM3.6001 20.4H10.2001V19.92H4.0801V13.776H3.6001V20.4ZM3.6001 10.2H4.0801V4.07998H10.2001V3.59998H3.6001V10.2ZM13.8001 20.4H20.4001V13.8H19.9201V19.92H13.8001V20.4Z"
        fill={color}
      />
    </svg>
  );
}

export default BracketsThin;
