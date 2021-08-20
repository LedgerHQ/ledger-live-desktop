import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledFinaRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8001 12.216V13.296H8.0881L10.7281 9.28801H10.8481C10.8241 10.176 10.8001 11.232 10.8001 12.216ZM4.1521 21.24H10.6081C15.7921 21.24 19.8481 17.016 19.8481 12C19.8481 6.84001 15.7681 2.76001 10.6081 2.76001H4.1521V4.32001H10.6081C14.9281 4.32001 18.2881 7.68001 18.2881 12C18.2881 16.176 14.9281 19.68 10.6081 19.68H4.1521V21.24ZM6.6241 14.568H10.8001V16.464H12.2881V14.568H13.6801V13.296H12.2881V7.58401H10.4881L6.6241 13.416V14.568Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledFinaRegular;
