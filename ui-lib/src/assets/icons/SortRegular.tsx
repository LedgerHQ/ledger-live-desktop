import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SortRegular({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3121 6.98401L7.9441 2.64001L3.6001 6.98401L4.5841 7.94402L5.8561 6.69601C6.2881 6.24002 6.7681 5.76002 7.2001 5.28001V20.4H8.6881V5.23201C9.1441 5.73601 9.6001 6.21601 10.0561 6.69601L11.3521 7.94402L12.3121 6.98401ZM11.6881 17.016L16.0561 21.36L20.4001 17.016L19.4161 16.056L18.1681 17.304C17.7121 17.76 17.2561 18.24 16.8001 18.72V3.60001H15.3121V18.744C14.8561 18.264 14.4001 17.76 13.9441 17.304L12.6721 16.056L11.6881 17.016Z"
        fill={color}
      />
    </svg>
  );
}

export default SortRegular;
