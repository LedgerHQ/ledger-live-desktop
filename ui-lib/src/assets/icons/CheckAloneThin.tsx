import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function CheckAloneThin({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.23193 12.66L8.39993 18.828L21.7679 5.508L21.4319 5.172L8.39993 18.156L2.56793 12.324L2.23193 12.66Z"
        fill={color}
      />
    </svg>
  );
}

export default CheckAloneThin;
