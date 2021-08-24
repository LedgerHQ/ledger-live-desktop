import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowDownRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9562 20.34H20.3402V10.956L18.9722 10.932V15.636C18.9722 16.404 18.9962 17.196 18.9962 17.964L4.71616 3.66003L3.66016 4.71603L17.9642 18.996C17.1962 18.972 16.4042 18.972 15.6602 18.972H10.9562V20.34Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowDownRegular;
