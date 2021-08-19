import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ChevronBottomLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.01993 7.164L3.17993 8.004L11.9879 16.836L20.8199 8.004L19.9799 7.164L11.9879 15.132L4.01993 7.164Z"
        fill={color}
      />
    </svg>
  );
}

export default ChevronBottomLight;
