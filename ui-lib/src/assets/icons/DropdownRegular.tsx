import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropdownRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0002 15.348L17.5922 9.75598L16.4882 8.65198L12.0002 13.14L7.5122 8.65198L6.4082 9.75598L12.0002 15.348Z"
        fill={color}
      />
    </svg>
  );
}

export default DropdownRegular;
