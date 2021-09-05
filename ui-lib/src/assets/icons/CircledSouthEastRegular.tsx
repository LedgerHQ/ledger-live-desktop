import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CircledSouthEastRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.62377 15.792H15.7918V9.64801H14.4238V11.376C14.4238 12.024 14.4238 12.72 14.4478 13.392L9.02377 7.96801L7.96777 9.02401L13.4158 14.472C12.7198 14.448 12.0478 14.4 11.3758 14.4L9.62377 14.424V15.792ZM2.75977 12C2.75977 17.16 6.83977 21.24 11.9998 21.24C17.1838 21.24 21.2398 17.04 21.2398 12C21.2398 6.84001 17.1598 2.76001 11.9998 2.76001C6.83977 2.76001 2.75977 6.84001 2.75977 12ZM4.31977 12C4.31977 7.68001 7.70377 4.32001 11.9998 4.32001C16.3198 4.32001 19.6798 7.68001 19.6798 12C19.6798 16.176 16.3198 19.68 11.9998 19.68C7.70377 19.68 4.31977 16.296 4.31977 12Z"
        fill={color}
      />
    </svg>
  );
}

export default CircledSouthEastRegular;
