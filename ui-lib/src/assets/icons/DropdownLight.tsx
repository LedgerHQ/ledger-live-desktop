import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropdownLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 15.156L17.4718 9.70799L16.6078 8.84399L11.9998 13.476L7.39183 8.84399L6.52783 9.70799L11.9998 15.156Z"
        fill={color}
      />
    </svg>
  );
}

export default DropdownLight;
