import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function PortfolioUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 19.92H21.3601V19.08H3.48014V4.08H2.64014V19.92ZM4.99214 15.552L10.8961 9.696L13.7761 12.576L21.0001 5.352L20.4241 4.776L13.7761 11.424L10.8961 8.544L4.99214 14.424V15.552Z"
        fill={color}
      />
    </svg>
  );
}

export default PortfolioUltraLight;
