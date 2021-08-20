import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PowerThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.32 22.32L18.936 9.83999H12.528L13.68 1.67999L5.06396 14.16H11.472L10.32 22.32ZM5.97596 13.68L12.912 3.59999L12 10.32H18.024L11.088 20.4L12 13.68H5.97596Z"
        fill={color}
      />
    </svg>
  );
}

export default PowerThin;
