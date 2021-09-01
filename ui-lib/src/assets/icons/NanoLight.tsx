import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function NanoLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8559 22.32L22.3199 17.856L6.14393 1.67999L1.67993 6.14399L17.8559 22.32ZM3.21593 6.14399L6.14393 3.19199L12.9839 10.032C12.2399 10.008 11.4719 10.296 10.8719 10.872C10.2959 11.448 10.0319 12.24 10.0559 12.984L3.21593 6.14399ZM11.5919 14.52C10.8479 13.752 10.8479 12.456 11.6399 11.64C12.4559 10.848 13.7519 10.848 14.5199 11.592L20.8079 17.856L17.8559 20.808L11.5919 14.52ZM12.0239 13.176C12.0239 13.824 12.5519 14.352 13.1759 14.352C13.8239 14.352 14.3519 13.824 14.3519 13.176C14.3519 12.528 13.8239 12 13.1759 12C12.5519 12 12.0239 12.528 12.0239 13.176Z"
        fill={color}
      />
    </svg>
  );
}

export default NanoLight;
