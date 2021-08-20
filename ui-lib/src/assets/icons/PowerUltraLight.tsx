import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PowerUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.296 22.332L19.272 9.732H12.84L13.704 1.668L4.72803 14.292H11.136L10.296 22.332ZM6.28803 13.5L12.696 4.428L12 10.5H17.712L11.304 19.596L12 13.5H6.28803Z"
        fill={color}
      />
    </svg>
  );
}

export default PowerUltraLight;
