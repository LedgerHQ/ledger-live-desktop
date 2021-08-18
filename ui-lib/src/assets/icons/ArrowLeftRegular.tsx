import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowLeftRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.27593 18.624L10.2599 17.664L6.92393 14.352C6.39593 13.824 5.84393 13.272 5.26793 12.744H21.3719V11.256H5.26793C5.84393 10.728 6.39593 10.176 6.92393 9.64798L10.2599 6.33598L9.27593 5.37598L2.62793 12L9.27593 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowLeftRegular;
