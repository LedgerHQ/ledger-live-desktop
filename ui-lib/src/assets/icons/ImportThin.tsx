import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ImportThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 20.16H20.8801V13.44H20.4001V19.68H3.60012V13.44H3.12012V20.16ZM7.65612 12.456L12.0001 16.8L16.3441 12.456L16.0081 12.12L14.1361 13.992L12.2401 15.888V3.84003H11.7601V15.888L9.86412 13.992L7.99212 12.12L7.65612 12.456Z"
        fill={color}
      />
    </svg>
  );
}

export default ImportThin;
