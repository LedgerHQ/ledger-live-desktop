import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledMediThin({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.08 11.664V13.848H8.88001L12.72 8.064H13.08V11.664ZM5.76001 20.88H18.24V20.4H5.76001V20.88ZM5.76001 3.6H18.24V3.12H5.76001V3.6ZM8.37601 14.328H13.08V16.464H13.56V14.328H15.072V13.848H13.56V7.584H12.48L8.37601 13.752V14.328Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledMediThin;
