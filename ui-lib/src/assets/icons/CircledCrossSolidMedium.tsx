import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledCrossSolidMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 21.3599C17.2561 21.3599 21.3601 17.0879 21.3601 11.9999C21.3601 6.76789 17.2321 2.63989 12.0001 2.63989C6.76814 2.63989 2.64014 6.76789 2.64014 11.9999C2.64014 17.2319 6.76814 21.3599 12.0001 21.3599ZM7.20014 15.4559L10.6321 11.9999L7.20014 8.54389L8.54414 7.19989L12.0001 10.6319L15.4561 7.19989L16.8001 8.54389L13.3681 11.9999L16.8001 15.4559L15.4561 16.7999L12.0001 13.3679L8.54414 16.7999L7.20014 15.4559Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledCrossSolidMedium;
