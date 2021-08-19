import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BracketsLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.6801 10.2H20.8801V3.12H13.8001V4.32H19.6801V10.2ZM3.12012 20.88H10.2001V19.656H4.32012V13.776H3.12012V20.88ZM3.12012 10.2H4.32012V4.32H10.2001V3.12H3.12012V10.2ZM13.8001 20.88H20.8801V13.8H19.6801V19.68H13.8001V20.88Z"
        fill={color}
      />
    </svg>
  );
}

export default BracketsLight;
