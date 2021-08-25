import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function PlusUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.4001 11.568H12.4321V3.60001H11.5681V11.568H3.6001V12.432H11.5681V20.4H12.4321V12.432H20.4001V11.568Z"
        fill={color}
      />
    </svg>
  );
}

export default PlusUltraLight;
