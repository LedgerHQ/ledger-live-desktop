import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BandwithThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.1599 20.4H20.6399V3.59998H20.1599V20.4ZM3.35986 20.4H3.83986V16.152H3.35986V20.4ZM7.55986 20.4H8.03986V13.008H7.55986V20.4ZM11.7599 20.4H12.2399V9.86398H11.7599V20.4ZM15.9599 20.4H16.4399V6.71998H15.9599V20.4Z"
        fill={color}
      />
    </svg>
  );
}

export default BandwithThin;
