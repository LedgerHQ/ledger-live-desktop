import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CrownUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 16.356H21V5.124L15.792 9.06L12 4.284L8.208 9.06L3 5.124V16.356ZM3 19.716H21V18.9H3V19.716ZM3.84 15.54V6.78L8.352 10.188L12 5.604L15.648 10.188L20.184 6.78V15.54H3.84Z"
        fill={color}
      />
    </svg>
  );
}

export default CrownUltraLight;
