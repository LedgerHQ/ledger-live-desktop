import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SortMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3121 6.98389L7.9441 2.63989L3.6001 6.98389L4.8001 8.15989L5.8561 7.10389C6.2401 6.71989 6.6481 6.28789 7.0321 5.85589V20.3999H8.8561V5.80789C9.2641 6.26389 9.6481 6.69589 10.0561 7.10389L11.1361 8.15989L12.3121 6.98389ZM11.6881 17.0159L16.0561 21.3599L20.4001 17.0159L19.2001 15.8399L18.1441 16.8959C17.7601 17.2799 17.3521 17.7119 16.9681 18.1439V3.59989H15.1441V18.1919C14.7361 17.7359 14.3521 17.3039 13.9441 16.8959L12.8641 15.8399L11.6881 17.0159Z"
        fill={color}
      />
    </svg>
  );
}

export default SortMedium;
