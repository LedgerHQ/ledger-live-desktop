import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExportUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 20.46H21V13.62H20.16V19.62H3.84V13.62H3V20.46ZM7.656 7.884L8.208 8.436L9.888 6.756C10.44 6.204 11.04 5.604 11.592 5.028V16.5H12.408V5.004C12.984 5.604 13.56 6.18 14.136 6.756L15.816 8.436L16.344 7.884L12 3.54L7.656 7.884Z"
        fill={color}
      />
    </svg>
  );
}

export default ExportUltraLight;
