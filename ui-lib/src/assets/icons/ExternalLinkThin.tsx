import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ExternalLinkThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.12012 20.88L18.9601 20.856V12H18.4801V20.376L3.60012 20.4V5.52H12.0001V5.04H3.12012V20.88ZM11.0161 12.648L11.3521 12.984L20.4001 3.936V6.888V9.288H20.8801V3.12H14.7361V3.6H17.1361H20.0401L11.0161 12.648Z"
        fill={color}
      />
    </svg>
  );
}

export default ExternalLinkThin;
