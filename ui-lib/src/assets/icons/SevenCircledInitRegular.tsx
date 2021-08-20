import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SevenCircledInitRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.6401 16.464H13.4401C13.6801 13.368 14.7601 10.92 16.7761 8.97601V7.58401H10.0561V8.95201H14.9041V9.26401C13.0081 11.424 11.9521 13.8 11.6401 16.464ZM4.1521 12C4.1521 17.16 8.2321 21.24 13.3921 21.24H19.8481V19.68H13.3921C9.0961 19.68 5.7121 16.296 5.7121 12C5.7121 7.80001 9.0961 4.32001 13.3921 4.32001H19.8481V2.76001H13.3921C8.2081 2.76001 4.1521 6.96001 4.1521 12Z"
        fill={color}
      />
    </svg>
  );
}

export default SevenCircledInitRegular;
