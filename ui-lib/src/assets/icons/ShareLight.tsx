import * as React from "react";
type Props = {
  size: number;
  color?: string;
};

function ShareLight({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.84009 20.52H20.1601V11.64H16.3201V12.84H18.9601V19.32H5.04009V12.84H7.68009V11.64H3.84009V20.52ZM7.65609 7.82398L8.42409 8.56798L9.88809 7.10398C10.3921 6.59998 10.9201 6.07198 11.4241 5.54398V16.44H12.5761V5.51998C13.1041 6.04798 13.6081 6.59998 14.1361 7.10398L15.6001 8.56798L16.3681 7.82398L12.0001 3.47998L7.65609 7.82398Z"
        fill={color}
      />
    </svg>
  );
}

export default ShareLight;
