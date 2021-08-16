import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function WifiLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.95605 8.49594L2.82005 9.40794C5.19605 7.12794 8.26806 5.71194 11.9881 5.71194C15.7081 5.71194 18.7801 7.12794 21.1561 9.40794L22.0441 8.49594C19.5001 6.07194 15.9961 4.43994 11.9881 4.43994C7.98006 4.43994 4.47605 6.07194 1.95605 8.49594ZM5.07606 11.9039L5.91605 12.8399C7.59606 11.3759 9.56406 10.5599 11.9881 10.5599C14.4121 10.5599 16.3801 11.3999 18.0601 12.8399L18.9001 11.9039C17.0521 10.3199 14.6761 9.28794 11.9881 9.28794C9.30006 9.28794 6.92406 10.2959 5.07606 11.9039ZM8.26806 15.4319L11.9881 19.5599L15.7321 15.4319C14.7481 14.5919 13.4521 14.0639 11.9881 14.0639C10.5481 14.0639 9.27606 14.5919 8.26806 15.4319Z"
        fill={color}
      />
    </svg>
  );
}

export default WifiLight;
