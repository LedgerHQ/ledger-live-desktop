import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SearchMedium({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.1678 16.6081L20.7598 22.2001L22.1998 20.76L16.6078 15.168C17.7118 13.752 18.3598 12 18.3598 10.08C18.3598 5.52005 14.6398 1.80005 10.0798 1.80005C5.5198 1.80005 1.7998 5.52005 1.7998 10.08C1.7998 14.64 5.5198 18.3601 10.0798 18.3601C11.9998 18.3601 13.7518 17.7121 15.1678 16.6081ZM3.7198 10.08C3.7198 6.57605 6.57581 3.72005 10.0798 3.72005C13.5838 3.72005 16.4398 6.57605 16.4398 10.08C16.4398 13.5841 13.5838 16.4401 10.0798 16.4401C6.57581 16.4401 3.7198 13.5841 3.7198 10.08Z"
        fill={color}
      />
    </svg>
  );
}

export default SearchMedium;
