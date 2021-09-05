import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ArrowDownMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0161 20.4001H20.4001V11.0161L18.7201 10.9921V15.7681C18.7201 16.3201 18.7441 16.9201 18.7681 17.4961L4.8961 3.6001L3.6001 4.8961L17.4961 18.7681C16.9201 18.7441 16.3201 18.7201 15.7681 18.7201H10.9921L11.0161 20.4001Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowDownMedium;
