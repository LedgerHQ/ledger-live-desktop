import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropdownThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14.772L17.208 9.56403L16.872 9.22803L12 14.1L7.12799 9.22803L6.79199 9.56403L12 14.772Z"
        fill={color}
      />
    </svg>
  );
}

export default DropdownThin;
