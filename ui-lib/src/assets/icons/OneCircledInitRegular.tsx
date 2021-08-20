import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OneCircledInitRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4641 13.128V16.464H15.0241V7.58401H13.0321L10.1281 10.272V12.12L13.1041 9.38401H13.5121C13.5121 9.69601 13.4641 11.208 13.4641 13.128ZM4.1521 12C4.1521 17.16 8.2321 21.24 13.3921 21.24H19.8481V19.68H13.3921C9.0961 19.68 5.7121 16.296 5.7121 12C5.7121 7.80001 9.0961 4.32001 13.3921 4.32001H19.8481V2.76001H13.3921C8.2081 2.76001 4.1521 6.96001 4.1521 12Z"
        fill={color}
      />
    </svg>
  );
}

export default OneCircledInitRegular;
