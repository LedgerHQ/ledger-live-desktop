import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronRightRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.97192 19.848L8.07592 20.952L17.0279 12L8.07592 3.04797L6.97192 4.15197L14.8199 12L6.97192 19.848Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronRightRegular;
