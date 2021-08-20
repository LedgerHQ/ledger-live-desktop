import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledPlusSolidThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 20.88C16.9681 20.88 20.8801 16.848 20.8801 12C20.8801 7.032 16.9681 3.12 12.0001 3.12C7.03212 3.12 3.12012 7.032 3.12012 12C3.12012 16.968 7.03212 20.88 12.0001 20.88ZM6.62412 12.24V11.76H11.7601V6.624H12.2401V11.76H17.3761V12.24H12.2401V17.376H11.7601V12.24H6.62412Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledPlusSolidThin;
