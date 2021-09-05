import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MenuBurgerLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75977 7.08H21.2398V5.88H2.75977V7.08ZM2.99983 18.12H21.2398V16.92H2.99983V18.12ZM2.99983 12.6H21.2398V11.4H2.99983V12.6Z"
        fill={color}
      />
    </svg>
  );
}

export default MenuBurgerLight;
