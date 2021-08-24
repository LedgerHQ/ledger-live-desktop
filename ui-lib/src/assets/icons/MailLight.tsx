import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MailLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.87988 19.092H21.1199V4.90802H2.87988V19.092ZM4.07988 17.94V9.10802L11.9999 15.444L19.9199 9.10802V17.94H4.07988ZM4.07988 7.62002V6.03602H19.9199V7.62002L11.9999 13.956L4.07988 7.62002Z"
        fill={color}
      />
    </svg>
  );
}

export default MailLight;
