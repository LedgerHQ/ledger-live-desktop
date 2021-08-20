import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ActivityMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 13.02H7.05614L9.19214 6.63604L14.8081 23.46L18.3121 13.02H21.3601V10.98H16.9681L14.8081 17.364L9.19214 0.540039L5.71214 10.98H2.64014V13.02Z"
        fill={color}
      />
    </svg>
  );
}

export default ActivityMedium;
