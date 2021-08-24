import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropupThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 9.22797L17.208 14.436L16.872 14.772L12 9.89997L7.12799 14.772L6.79199 14.436L12 9.22797Z"
        fill={color}
      />
    </svg>
  );
}

export default DropupThin;
