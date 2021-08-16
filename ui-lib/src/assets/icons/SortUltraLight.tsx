import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function SortUltraLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.2881 6.98401L7.9441 2.64001L3.6001 6.98401L4.1521 7.53602L5.8321 5.85601C6.3841 5.30401 6.9841 4.70401 7.5361 4.12801V20.4H8.3521V4.10401C8.9281 4.70401 9.5041 5.28001 10.0801 5.85601L11.7601 7.53602L12.2881 6.98401ZM11.7121 17.016L16.0561 21.36L20.4001 17.016L19.8481 16.464L18.1921 18.144C17.6161 18.696 17.0401 19.296 16.4641 19.872V3.60001H15.6481V19.872C15.0721 19.296 14.4961 18.696 13.9201 18.144L12.2641 16.464L11.7121 17.016Z"
        fill={color}
      />
    </svg>
  );
}

export default SortUltraLight;
