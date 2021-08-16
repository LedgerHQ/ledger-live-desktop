import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ReverseThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0001 21.12C16.8481 21.12 20.8801 17.088 20.8801 12.24C20.8801 7.392 16.8481 3.36 12.0001 3.36C8.61612 3.36 5.61612 5.376 4.08012 8.28V5.544V2.88H3.60012V9.024H9.74412V8.544H7.08012H4.48812C5.95212 5.76 8.80812 3.84 12.0001 3.84C16.6081 3.84 20.4001 7.656 20.4001 12.24C20.4001 16.824 16.5841 20.64 12.0001 20.64C7.41612 20.64 3.60012 16.824 3.60012 12.24H3.12012C3.12012 17.088 7.15212 21.12 12.0001 21.12Z"
        fill={color}
      />
    </svg>
  );
}

export default ReverseThin;
