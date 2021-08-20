import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledPlusSolidUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C17.04 21 21 16.896 21 12C21 6.96 17.04 3 12 3C6.96 3 3 6.96 3 12C3 17.04 6.96 21 12 21ZM6.624 12.408V11.568H11.568V6.624H12.432V11.568H17.376V12.408H12.432V17.376H11.568V12.408H6.624Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledPlusSolidUltraLight;
