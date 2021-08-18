import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function HouseLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.32018 21.36H10.7522V14.328H13.2722V21.36H19.6802V11.184L21.5042 12.84L22.3202 12L12.0002 2.64001L1.68018 12L2.49618 12.84L4.32018 11.184V21.36ZM5.49618 20.208V10.128L12.0002 4.22401L18.5282 10.128V20.208H14.3522V13.248H9.67218V20.208H5.49618Z"
        fill={color}
      />
    </svg>
  );
}

export default HouseLight;
