import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function DelegateUltraLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.40796 12.444V20.844H4.24796V12.444C4.24796 9.9 6.21596 7.908 8.78396 7.908H19.128C18.528 8.484 17.952 9.06 17.376 9.636L15.696 11.292L16.248 11.844L20.592 7.5L16.248 3.156L15.696 3.708L17.376 5.364C17.928 5.94 18.528 6.516 19.104 7.092H8.78396C5.80796 7.092 3.40796 9.516 3.40796 12.444Z"
        fill={color}
      />
    </svg>
  );
}

export default DelegateUltraLight;
