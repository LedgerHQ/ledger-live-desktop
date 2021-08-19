import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OneCircledFinaRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6801 13.128V16.464H12.2401V7.58401H10.2481L7.3441 10.272V12.12L10.3201 9.38401H10.7281C10.7281 9.69601 10.6801 11.208 10.6801 13.128ZM4.1521 21.24H10.6081C15.7921 21.24 19.8481 17.016 19.8481 12C19.8481 6.84001 15.7681 2.76001 10.6081 2.76001H4.1521V4.32001H10.6081C14.9281 4.32001 18.2881 7.68001 18.2881 12C18.2881 16.176 14.9281 19.68 10.6081 19.68H4.1521V21.24Z"
        fill={color}
      />
    </svg>
  );
}

export default OneCircledFinaRegular;
