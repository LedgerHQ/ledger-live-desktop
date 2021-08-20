import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ImportUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 20.22H21V13.38H20.16V19.38H3.84V13.38H3V20.22ZM7.656 12.396L12 16.74L16.344 12.396L15.792 11.844L14.136 13.524C13.56 14.076 12.984 14.676 12.408 15.252V3.78H11.592V15.252C11.016 14.676 10.44 14.076 9.864 13.524L8.208 11.844L7.656 12.396Z"
        fill={color}
      />
    </svg>
  );
}

export default ImportUltraLight;
