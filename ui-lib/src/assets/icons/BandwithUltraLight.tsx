import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function BandwithUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9439 20.4H20.8079V3.6H19.9439V20.4ZM3.19189 20.4H4.05589V16.152H3.19189V20.4ZM7.36789 20.4H8.25589V13.008H7.36789V20.4ZM11.5679 20.4H12.4319V9.864H11.5679V20.4ZM15.7439 20.4H16.6319V6.72H15.7439V20.4Z"
        fill={color}
      />
    </svg>
  );
}

export default BandwithUltraLight;
