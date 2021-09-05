import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PortfolioLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 19.92H21.3601V18.744H3.84014V4.08002H2.64014V19.92ZM5.40014 15.384L10.8961 9.93602L13.7761 12.816L21.1201 5.47202L20.3041 4.65602L13.7761 11.184L10.8961 8.30402L5.40014 13.752V15.384Z"
        fill={color}
      />
    </svg>
  );
}

export default PortfolioLight;
