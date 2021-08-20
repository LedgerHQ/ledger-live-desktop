import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ActivityThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.66797 12.252H5.77197L8.79597 3.20403L15.156 22.332L18.54 12.252H22.332V11.772H18.204L15.156 20.796L8.79597 1.66803L5.43597 11.772H1.66797V12.252Z"
        fill={color}
      />
    </svg>
  );
}

export default ActivityThin;
