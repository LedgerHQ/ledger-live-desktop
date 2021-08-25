import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function OneCircledInitLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.476 12.72V16.464H14.676V7.584H12.924L9.89997 10.392V11.832L13.044 8.928H13.524C13.524 9.552 13.476 11.016 13.476 12.72ZM4.11597 12C4.11597 17.088 8.14797 21.12 13.236 21.12H19.884V19.92H13.236C8.79597 19.92 5.31597 16.44 5.31597 12C5.31597 7.68001 8.79597 4.08 13.236 4.08H19.884V2.88H13.236C8.12397 2.88 4.11597 7.032 4.11597 12Z"
        fill={color}
      />
    </svg>
  );
}

export default OneCircledInitLight;
