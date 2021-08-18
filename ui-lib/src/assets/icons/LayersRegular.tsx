import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function LayersRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 12.264L22.0799 7.48801L11.9999 2.76001L1.91992 7.48801L11.9999 12.264ZM1.91992 16.488L11.9999 21.24L22.0799 16.488L20.3279 15.648L11.9999 19.56L3.67192 15.648L1.91992 16.488ZM1.91992 12L11.9999 16.776L22.0799 12L20.3279 11.16L11.9999 15.072L3.67192 11.16L1.91992 12ZM5.44792 7.48801L11.9999 4.41601L18.5519 7.48801L11.9999 10.608L5.44792 7.48801Z"
        fill={color}
      />
    </svg>
  );
}

export default LayersRegular;
