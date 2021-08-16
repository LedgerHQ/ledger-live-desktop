import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function StreamThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 6.76799H16.5601V6.28799H2.64014V6.76799ZM2.64014 17.712H16.5601V17.232H2.64014V17.712ZM7.44014 12.24H21.3601V11.76H7.44014V12.24Z"
        fill={color}
      />
    </svg>
  );
}

export default StreamThin;
