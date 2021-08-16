import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ExternalLinkMedium({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.64014 21.3599L19.4401 21.3359V11.9999H17.5201V19.4159L4.56014 19.4399V6.47989H12.0001V4.55989H2.64014V21.3599ZM10.5361 12.1679L11.8321 13.4639L19.7521 5.54389C19.7281 6.14389 19.6801 6.71989 19.6801 7.29589L19.7041 8.80789H21.3601V2.63989H15.2161V4.31989H16.7281C17.2561 4.31989 17.8561 4.31989 18.4321 4.27189L10.5361 12.1679Z"
        fill={color}
      />
    </svg>
  );
}

export default ExternalLinkMedium;
