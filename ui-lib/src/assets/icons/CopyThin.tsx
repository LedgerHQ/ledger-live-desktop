import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CopyThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0401 15.12H20.8801V3.12L8.88012 3.144V6.96H9.36012V3.624L20.4001 3.6V14.64H17.0401V15.12ZM3.12012 20.88H15.1201V8.88H3.12012V20.88ZM3.60012 20.4V9.36H14.6401V20.4H3.60012Z"
        fill={color}
      />
    </svg>
  );
}

export default CopyThin;
