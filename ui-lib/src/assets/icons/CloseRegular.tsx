import * as React from "react";
type Props = {
  size?: number | string;
  color?: string;
};

function CloseRegular({ size = 16, color = "currentColor" }: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.1839 18.984L13.1999 12L20.1839 5.01601L18.9359 3.86401L11.9999 10.8L5.06392 3.86401L3.81592 5.01601L10.7999 12L3.81592 18.984L5.06392 20.136L11.9999 13.2L18.9359 20.136L20.1839 18.984Z"
        fill={color}
      />
    </svg>
  );
}

export default CloseRegular;
