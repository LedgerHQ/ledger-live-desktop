import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowLeftMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.27593 18.624L10.4759 17.448L7.09193 14.088C6.70793 13.704 6.27593 13.296 5.84393 12.912H21.3719V11.088H5.84393C6.27593 10.704 6.70793 10.296 7.09193 9.91198L10.4759 6.55198L9.27593 5.37598L2.62793 12L9.27593 18.624Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowLeftMedium;
