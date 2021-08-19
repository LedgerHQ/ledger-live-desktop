import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledSouthWestRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.20777 15.792H14.3518V14.4H12.6238C11.9758 14.4 11.2798 14.4 10.6078 14.448L16.0318 9.02401L14.9758 7.96801L9.52777 13.416C9.55177 12.72 9.59977 12.048 9.59977 11.352L9.57577 9.62401H8.20777V15.792ZM2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12ZM4.31977 12C4.31977 7.68001 7.70377 4.32001 11.9998 4.32001C16.3198 4.32001 19.6798 7.68001 19.6798 12C19.6798 16.176 16.3198 19.68 11.9998 19.68C7.70377 19.68 4.31977 16.296 4.31977 12Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledSouthWestRegular;
