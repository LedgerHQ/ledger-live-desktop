import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MenuBurgerRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.7002 7.24799H21.3002V5.68799H2.7002V7.24799ZM2.7002 18.288H21.3002V16.728H2.7002V18.288ZM2.7002 12.768H21.3002V11.208H2.7002V12.768Z"
        fill={color}
      />
    </svg>
  );
}

export default MenuBurgerRegular;
