import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function FourCircledFinaLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.268 12.024V13.464H8.05197L11.1 8.88H11.292C11.268 9.86401 11.268 10.968 11.268 12.024ZM4.11597 21.12H10.764C15.876 21.12 19.884 16.968 19.884 12C19.884 6.888 15.876 2.88 10.764 2.88H4.11597V4.08H10.764C15.204 4.08 18.684 7.56 18.684 12C18.684 16.32 15.204 19.92 10.764 19.92H4.11597V21.12ZM6.89997 14.496H11.268V16.464H12.396V14.496H13.836V13.464H12.396V7.584H10.86L6.89997 13.512V14.496Z"
        fill={color}
      />
    </svg>
  );
}

export default FourCircledFinaLight;
