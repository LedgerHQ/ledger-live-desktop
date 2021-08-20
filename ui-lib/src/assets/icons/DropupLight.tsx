import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DropupLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 8.84401L17.4718 14.292L16.6078 15.156L11.9998 10.524L7.39183 15.156L6.52783 14.292L11.9998 8.84401Z"
        fill={color}
      />
    </svg>
  );
}

export default DropupLight;
