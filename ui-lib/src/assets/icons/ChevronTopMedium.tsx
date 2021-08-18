import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronTopMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.27198 17.22L12 9.51603L19.728 17.22L21.072 15.876L12 6.78003L2.92798 15.876L4.27198 17.22Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronTopMedium;
