import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MenuBurgerUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.81982 6.888H21.1798V6.048H2.81982V6.888ZM2.81982 17.928H21.1798V17.088H2.81982V17.928ZM2.81982 12.408H21.1798V11.568H2.81982V12.408Z"
        fill={color}
      />
    </svg>
  );
}

export default MenuBurgerUltraLight;
