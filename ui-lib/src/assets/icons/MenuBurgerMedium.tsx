import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MenuBurgerMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.44014 7.44003H21.3601V5.52003H7.44014V7.44003ZM2.64014 18.72H21.3601V16.32H2.64014V18.72ZM2.64014 13.2H21.3601V10.8H2.64014V13.2ZM2.64014 7.68003H21.3601V5.28003H2.64014V7.68003ZM7.44014 18.48H21.3601V16.56H7.44014V18.48ZM7.44014 12.96H21.3601V11.04H7.44014V12.96Z"
        fill={color}
      />
    </svg>
  );
}

export default MenuBurgerMedium;
