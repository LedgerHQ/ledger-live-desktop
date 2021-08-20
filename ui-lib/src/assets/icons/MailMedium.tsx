import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function MailMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 19.332H21.3601V4.66797H2.64014V19.332ZM4.56014 17.532V9.99597L12.0001 15.948L19.4401 9.99597V17.532H4.56014ZM4.56014 7.64397V6.46797H19.4401V7.64397L12.0001 13.596L4.56014 7.64397Z"
        fill={color}
      />
    </svg>
  );
}

export default MailMedium;
