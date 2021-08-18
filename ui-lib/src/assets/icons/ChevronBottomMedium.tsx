import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronBottomMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.27198 6.78003L2.92798 8.12403L12 17.22L21.072 8.12403L19.728 6.78003L12 14.484L4.27198 6.78003Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronBottomMedium;
