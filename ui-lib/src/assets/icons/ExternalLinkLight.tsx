import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ExternalLinkLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.87988 21.12L19.1999 21.096V12H17.9999V19.896L4.07988 19.92V6.00001H11.9999V4.8H2.87988V21.12ZM10.7759 12.408L11.5919 13.224L20.0879 4.728C20.0639 5.52 20.0399 6.312 20.0399 7.08L20.0639 9.04801H21.1199V2.88H14.9759V3.96H16.9439C17.6879 3.96 18.4799 3.96 19.2479 3.936L10.7759 12.408Z"
        fill={color}
      />
    </svg>
  );
}

export default ExternalLinkLight;
