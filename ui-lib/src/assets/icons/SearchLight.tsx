import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function SearchLight({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2998 16.188L21.0358 21.948L21.9478 21.036L16.1878 15.3C17.4118 13.908 18.1318 12.084 18.1318 10.092C18.1318 5.676 14.5078 2.052 10.0918 2.052C5.67576 2.052 2.05176 5.676 2.05176 10.092C2.05176 14.508 5.67576 18.132 10.0918 18.132C12.0838 18.132 13.9078 17.412 15.2998 16.188ZM3.25176 10.092C3.25176 6.324 6.32376 3.252 10.0918 3.252C13.8598 3.252 16.9318 6.324 16.9318 10.092C16.9318 13.86 13.8598 16.932 10.0918 16.932C6.32376 16.932 3.25176 13.86 3.25176 10.092Z"
        fill={color}
      />
    </svg>
  );
}

export default SearchLight;
