import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OthersMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4241 13.488H20.4001V10.512H17.4241V13.488ZM3.6001 13.488H6.5761V10.512H3.6001V13.488ZM10.5121 13.488H13.4881V10.512H10.5121V13.488Z"
        fill={color}
      />
    </svg>
  );
}

export default OthersMedium;
