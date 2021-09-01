import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PlusMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.4001 10.9681H13.0321V3.6001H10.9921V10.9681H3.6001V13.0081H10.9921V20.4001H13.0321V13.0081H20.4001V10.9681Z"
        fill={color}
      />
    </svg>
  );
}

export default PlusMedium;
