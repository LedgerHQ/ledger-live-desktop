import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CheckAloneUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.08789 12.732L8.39989 19.044L21.9119 5.58L21.2879 4.956L8.39989 17.796L2.71189 12.108L2.08789 12.732Z"
        fill={color}
      />
    </svg>
  );
}

export default CheckAloneUltraLight;
