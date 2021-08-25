import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BatteryHalfThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.35986 16.56H18.6959V14.4H20.6399V9.6H18.6959V7.44H3.35986V16.56ZM3.83986 16.08V7.92H18.2159V10.08H20.1599V13.92H18.2159V16.08H3.83986ZM5.27986 14.64H11.5199V9.36H5.27986V14.64Z"
        fill={color}
      />
    </svg>
  );
}

export default BatteryHalfThin;
