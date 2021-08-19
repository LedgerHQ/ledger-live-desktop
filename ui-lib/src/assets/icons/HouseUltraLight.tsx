import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function HouseUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.32018 21.36H10.5842V14.184H13.4162V21.36H19.6802V10.728L21.7442 12.6L22.3202 12L12.0002 2.64L1.68018 12L2.25618 12.6L4.32018 10.728V21.36ZM5.13618 20.544V9.96L12.0002 3.744L18.8642 9.96V20.544H14.1842V13.416H9.81618V20.544H5.13618Z"
        fill={color}
      />
    </svg>
  );
}

export default HouseUltraLight;
