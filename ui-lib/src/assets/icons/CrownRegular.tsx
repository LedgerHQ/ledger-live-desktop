import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CrownRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.76001 16.416H21.24V4.72801L15.84 8.80801L12 3.98401L8.16001 8.80801L2.76001 4.72801V16.416ZM2.76001 20.016H21.24V18.552H2.76001V20.016ZM4.29601 14.952V7.75201L8.42401 10.896L12 6.40801L15.576 10.896L19.728 7.75201V14.952H4.29601Z"
        fill={color}
      />
    </svg>
  );
}

export default CrownRegular;
