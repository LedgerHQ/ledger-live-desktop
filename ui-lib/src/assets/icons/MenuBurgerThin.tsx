import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function MenuBurgerThin({ size = 16, color = "currentColor" }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.87988 6.71999H21.1199V6.23999H2.87988V6.71999ZM2.87988 17.76H21.1199V17.28H2.87988V17.76ZM2.87988 12.24H21.1199V11.76H2.87988V12.24Z" fill={color} /></svg>;
}

export default MenuBurgerThin;