import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function GraphGrowAltThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 20.232H21.3601V19.752H3.12014V4.39201H2.64014V20.232ZM4.56014 15.12L9.96014 9.74401L12.8401 12.624L20.8801 4.58401V7.89601V9.93601H21.3601V3.76801H15.2161V4.24801H17.2561H20.5441L12.8401 11.952L9.96014 9.07201L4.56014 14.448V15.12Z"
        fill={color}
      />
    </svg>
  );
}

export default GraphGrowAltThin;
