import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function TransferMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0159 12.3121L21.3599 7.9441L17.0159 3.6001L15.8399 4.8001L16.8959 5.8561C17.2799 6.2401 17.7119 6.6481 18.1439 7.0321H3.59989V8.8561H18.1919C17.7359 9.2641 17.3039 9.6481 16.8959 10.0561L15.8399 11.1361L17.0159 12.3121ZM2.63989 16.0561L6.98389 20.4001L8.15989 19.2001L7.10389 18.1441C6.71989 17.7601 6.28789 17.3521 5.85589 16.9681H20.3999V15.1441H5.80789C6.26389 14.7361 6.69589 14.3521 7.10389 13.9441L8.15989 12.8641L6.98389 11.6881L2.63989 16.0561Z"
        fill={color}
      />
    </svg>
  );
}

export default TransferMedium;
