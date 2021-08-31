import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledInitLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.74 12.024V13.464H10.5L13.572 8.88H13.764C13.74 9.86401 13.74 10.968 13.74 12.024ZM4.11597 12C4.11597 17.088 8.14797 21.12 13.236 21.12H19.884V19.92H13.236C8.79597 19.92 5.31597 16.44 5.31597 12C5.31597 7.68001 8.79597 4.08 13.236 4.08H19.884V2.88H13.236C8.12397 2.88 4.11597 7.032 4.11597 12ZM9.37197 14.496H13.74V16.464H14.868V14.496H16.308V13.464H14.868V7.584H13.308L9.37197 13.512V14.496Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledInitLight;
