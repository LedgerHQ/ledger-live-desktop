import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function StreamLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 7.15205H16.5601V5.90405H2.64014V7.15205ZM2.64014 18.0961H16.5601V16.8481H2.64014V18.0961ZM7.44014 12.6241H21.3601V11.3761H7.44014V12.6241Z"
        fill={color}
      />
    </svg>
  );
}

export default StreamLight;
