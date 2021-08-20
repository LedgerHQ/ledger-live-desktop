import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StreamUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 6.95998H16.5601V6.09598H2.64014V6.95998ZM2.64014 17.904H16.5601V17.04H2.64014V17.904ZM7.44014 12.432H21.3601V11.568H7.44014V12.432Z"
        fill={color}
      />
    </svg>
  );
}

export default StreamUltraLight;
