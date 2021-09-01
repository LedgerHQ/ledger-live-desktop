import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OthersThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.9601 12.72H20.4001V11.28H18.9601V12.72ZM3.6001 12.72H5.0401V11.28H3.6001V12.72ZM11.2801 12.72H12.7201V11.28H11.2801V12.72Z"
        fill={color}
      />
    </svg>
  );
}

export default OthersThin;
