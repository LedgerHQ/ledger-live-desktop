import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MailUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18.972H21V5.028H3V18.972ZM3.84 18.156V8.676L12 15.204L20.16 8.676V18.156H3.84ZM3.84 7.596V5.844H20.16V7.596L12 14.124L3.84 7.596Z"
        fill={color}
      />
    </svg>
  );
}

export default MailUltraLight;
