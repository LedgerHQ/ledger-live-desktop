import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function HouseMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.32018 21.3599H11.0402V14.6399H12.9602V21.3599H19.6802V12.1199L21.0242 13.3439L22.3202 11.9999L12.0002 2.63989L1.68018 11.9999L2.97618 13.3439L4.32018 12.1199V21.3599ZM6.16818 19.5599V10.4399L12.0002 5.13589L17.8322 10.4399V19.5599H14.6402V12.9599H9.36018V19.5599H6.16818Z"
        fill={color}
      />
    </svg>
  );
}

export default HouseMedium;
