import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BandwithMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2602 20.4001H21.3002V3.6001H19.2602V20.4001ZM2.7002 20.4001H4.7402V16.1521H2.7002V20.4001ZM6.8282 20.4001H8.8682V13.0081H6.8282V20.4001ZM10.9802 20.4001H13.0202V9.8641H10.9802V20.4001ZM15.1322 20.4001H17.1722V6.7201H15.1322V20.4001Z"
        fill={color}
      />
    </svg>
  );
}

export default BandwithMedium;
