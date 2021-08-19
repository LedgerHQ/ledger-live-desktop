import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowTopThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.76 3.53999V21.372H12.24V3.53999L15.12 6.41999L18.288 9.58799L18.624 9.25199L12 2.62799L5.37598 9.25199L5.71198 9.58799L8.87998 6.41999L11.76 3.53999Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowTopThin;
