import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function WarningUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.47217 20.64H21.5282L12.0002 3.35999L2.47217 20.64ZM3.86417 19.848L12.0002 5.06399L20.1362 19.848H3.86417ZM11.1842 18.24H12.8162V16.608H11.1842V18.24ZM11.5682 12.096L11.6402 15.048H12.3602L12.4322 12.096V9.62398H11.5682V12.096Z"
        fill={color}
      />
    </svg>
  );
}

export default WarningUltraLight;
