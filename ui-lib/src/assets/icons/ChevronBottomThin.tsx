import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronBottomThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.76788 7.54797L3.43188 7.88397L11.9999 16.452L20.5679 7.88397L20.2319 7.54797L11.9999 15.78L3.76788 7.54797Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronBottomThin;
