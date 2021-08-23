import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropupMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 8.46004L17.7121 14.196L16.3681 15.54L12.0001 11.196L7.63209 15.54L6.28809 14.196L12.0001 8.46004Z"
        fill={color}
      />
    </svg>
  );
}

export default DropupMedium;
