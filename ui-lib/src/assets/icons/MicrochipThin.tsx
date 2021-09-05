import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MicrochipThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.28012 20.88H8.76012V17.52H11.7601V20.88H12.2401V17.52H15.2401V20.88H15.7201V17.52H17.5201V15.72H20.8801V15.24H17.5201V12.24H20.8801V11.76H17.5201V8.76H20.8801V8.28H17.5201V6.48H15.7201V3.12H15.2401V6.48H12.2401V3.12H11.7601V6.48H8.76012V3.12H8.28012V6.48H6.48012V8.28H3.12012V8.76H6.48012V11.76H3.12012V12.24H6.48012V15.24H3.12012V15.72H6.48012V17.52H8.28012V20.88ZM6.96012 17.04V6.96H17.0401V17.04H6.96012ZM9.48012 14.52H14.5201V9.48H9.48012V14.52ZM9.96012 14.04V9.96H14.0401V14.04H9.96012Z"
        fill={color}
      />
    </svg>
  );
}

export default MicrochipThin;
