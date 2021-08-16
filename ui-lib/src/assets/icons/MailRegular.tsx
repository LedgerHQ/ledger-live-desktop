import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function MailRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.75977 19.212H21.2398V4.78796H2.75977V19.212ZM4.31977 17.748V9.56396L11.9998 15.708L19.6798 9.56396V17.748H4.31977ZM4.31977 7.61996V6.25196H19.6798V7.61996L11.9998 13.764L4.31977 7.61996Z"
        fill={color}
      />
    </svg>
  );
}

export default MailRegular;
