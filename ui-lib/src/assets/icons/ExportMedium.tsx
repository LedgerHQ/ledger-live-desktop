import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExportMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 20.6401H21.3601V13.4401H19.4401V18.7201H4.56014V13.4401H2.64014V20.6401ZM7.65614 7.70411L8.85614 8.88011L9.91214 7.82411C10.2961 7.44011 10.7041 7.00811 11.0881 6.57611V16.3201H12.9121V6.52811C13.3201 6.98411 13.7041 7.41611 14.1121 7.82411L15.1921 8.88011L16.3681 7.70411L12.0001 3.36011L7.65614 7.70411Z"
        fill={color}
      />
    </svg>
  );
}

export default ExportMedium;
