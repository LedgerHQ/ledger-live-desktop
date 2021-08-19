import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CheckAloneRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.82397 12.852L8.39998 19.452L22.176 5.69997L21.024 4.54797L8.39998 17.1L2.97597 11.7L1.82397 12.852Z"
        fill={color}
      />
    </svg>
  );
}

export default CheckAloneRegular;
