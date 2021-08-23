import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CheckAloneLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.94409 12.816L8.40009 19.248L22.0561 5.66401L21.1441 4.75201L8.40009 17.472L2.85609 11.904L1.94409 12.816Z"
        fill={color}
      />
    </svg>
  );
}

export default CheckAloneLight;
