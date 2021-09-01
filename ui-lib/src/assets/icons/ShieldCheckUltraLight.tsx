import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function ShieldCheckUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 21.84C18.2399 19.368 21.3599 15.432 21.3599 10.128V5.088C18.6959 3.168 15.4559 2.16 11.9999 2.16C8.54389 2.16 5.30389 3.168 2.63989 5.088V10.128C2.63989 15.432 5.75989 19.368 11.9999 21.84ZM3.47989 10.128V5.496C5.95189 3.816 8.83189 2.976 11.9999 2.976C15.1679 2.976 18.0479 3.816 20.5199 5.496V10.128C20.5199 15.072 17.8079 18.576 11.9999 20.952C6.19189 18.576 3.47989 15.072 3.47989 10.128ZM8.11189 11.136L11.2799 14.328L16.7759 8.808L16.1999 8.232L11.2799 13.128L8.68789 10.56L8.11189 11.136Z"
        fill={color}
      />
    </svg>
  );
}

export default ShieldCheckUltraLight;
